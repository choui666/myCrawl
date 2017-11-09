(function (angular) {

    /**
     * 发送支付请求
     */
    angular.module('ourpalm-service-pcenter', ['ourpalm-util'])

        .service('PayService', ['$http', '$rootScope', '$q', 'Util', '$timeout', function ($http, $rootScope, $q, Util, $timeout) {
            var url = 'http://223.202.94.183:8081/billingcenter2.0/webOffical/main.do?';

            var __orderInfoInited = false;

            /**
             * 初始化计费中心的订单
             */
            function initOrderInfo() {
                var deferred = $q.defer();
                if (__orderInfoInited) {
                    $timeout(function () {
                        deferred.resolve();
                    })
                } else {
                    window.pageBridge.applyCall(function () {
                        window.pageBridge.invokeSdkGetOrderInfo(function (order) {
                            order = angular.fromJson(order);

                            $rootScope.goodsName = order.goodsName;
                            $rootScope.orderNum = order.orderId;
                            $rootScope.goodsPrice = order.cost;
                            $rootScope.currency = order.currency;
                            $rootScope.payTime = new Date();
                            $rootScope.errorMsg = '支付流程异常';
                            $rootScope.errorCode = '400';

                            //获取pcode41
                            var pcode41 = angular.fromJson(window.pageBridge.getPcodeInfo()).pcode41;
                            //获取支付方式信息
                            getPayType(pcode41, order.cost, order.currency).success(function (result) {
                                $rootScope.pcode24 = result.pcode24 || '';
                                $rootScope.pcode41 = result.pcode41 || '';
                                $rootScope.payChannel = {};
                                for (var i = 0, len = result.data.length; i < len; i++) {
                                    var paychannel = result.data[i];
                                    $rootScope.payChannel[paychannel.payChannelId] = paychannel;
                                    $rootScope.$broadcast('PayTypeDirective:show', paychannel);
                                }
                                __orderInfoInited = true;
                                deferred.resolve();
                            });
                        });
                    });
                }


                return deferred.promise;
            }

            /**
             * 发送支付请求协议
             */
            function prePay(payChannelId) {
                var param = $.param({
                    callback: 'JSON_CALLBACK',
                    jsonStr: JSON.stringify({
                        common: {
                            interfaceId: '0007',
                            pCode: $rootScope.pcode24,
                            netSource: '1'
                        },
                        options: {
                            orderId: $rootScope.orderNum,
                            payChannelId: payChannelId,
                            currencyType: 1, // 货币类型 大陆 1
                            chargeCash: $rootScope.goodsPrice,
                            payChannelParams: {
                                // agentCode: agentCode,
                                browserType: 'COPGAM05' // 电脑浏览器:COPGAM02、手机浏览器：COPGAM05
                            },
                            pageUrl: encodeURIComponent('http://localhost:8000/#/paysuccess'),
                            errorPageUrl: encodeURIComponent('http://localhost:8000/#/payfailure')
                        }
                    })
                });
                console.info(url + param);
                return $http.jsonp(url + param, {mask: true, handlerErrorCode: true});
            }

            /**
             * 以表单的方式处理响应结果 | 网银支付
             */
            function submitForm(url, param) {
                var $form = $(['<form action="', url, '" method="post"></form>'].join(''));
                for (var i in param) {
                    $form.append(['<input name="', i, '" value="', param[i], '"/>'].join(''));
                }
                $form.appendTo('body').submit();
            }

            /**
             * 通过移动运营商充值卡支付
             * 中国移动 | 中国联通 | 中国电信
             */
            function payByPhoneCard(cardType, username, password) {
                var param = $.param({
                    callback: 'JSON_CALLBACK',
                    jsonStr: JSON.stringify({
                        common: {
                            interfaceId: '0007',
                            pCode: $rootScope.pcode24,
                            netSource: '1'
                        },
                        options: {
                            orderId: $rootScope.orderNum,
                            payChannelId: '',
                            currencyType: 1, // 货币类型 大陆 1
                            chargeCash: $rootScope.goodsPrice,
                            payChannelParams: {
                                // agentCode: agentCode,
                                browserType: 'COPGAM05' // 电脑浏览器:COPGAM02、手机浏览器：COPGAM05
                            },
                            pageUrl: encodeURIComponent('http://localhost:8000/#/paysuccess'),
                            errorPageUrl: encodeURIComponent('http://localhost:8000/#/payfailure'),
                            cardtype: cardType,
                            user: username,
                            password: password
                        }
                    })
                });
                console.info(url + param);
                return $http.jsonp(url + param, {mask: true, handlerErrorCode: true});
            }


            /**
             * 获取支付方式 微信WAP | 网银支付 | 支付宝Wap | 支付宝客户端 | mo9钱包 | 手机卡
             * @param pcode
             * @param price
             * @param moneyType
             */
            function getPayType(pcode, price, moneyType) {
                var payTypeUrl = 'http://test.platform.gamebean.net/gwbilling/js/b007.htm?';
                var param = $.param({
                    callback: 'JSON_CALLBACK',
                    jsonStr: JSON.stringify({
                        time: new Date().getTime(),
                        pcode: pcode,
                        price: parseInt(price),
                        moneyType: moneyType // 1:人民币
                    })
                });
                console.info(payTypeUrl + param);
                return $http.jsonp(payTypeUrl + param, {mask: true, cache: false});
            }

            return {
                prePay: prePay,
                submitForm: submitForm,
                payByPhoneCard: payByPhoneCard,
                getPayType: getPayType,
                initOrderInfo: initOrderInfo
            }
        }])

})(angular);