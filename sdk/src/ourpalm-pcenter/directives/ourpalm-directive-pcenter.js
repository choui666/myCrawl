(function (angular) {

    /**
     * 微信h5 web支付
     */
    angular.module('ourpalm-app')

        .directive('weixinWebPay', function () {
            var payChannelInfo;
            return {
                restrict: 'AE',
                replace: true,
                // scope: {}, //创建隔离作用域
                /**
                 * 注意模板里面有国际化信息
                 */
                template: '<li ng-click="weixinWebPay();" ng-if="weixinWeb"><a href="javascript:void(0);"><em class="tj" translate="v1_key6"><!--推荐--></em><img src="http://content.gamebean.com/image/sdk/new/pay_icon01.png"/><span translate="v1_key7"><!--微信--></span></a></li>',
                controller: ['$scope', '$rootScope', 'PayService', function ($scope, $rootScope, PayService) {
                    payChannelInfo = !!$rootScope.payChannel ? $rootScope.payChannel['210544000112000051014300'] : '';
                    if (!!payChannelInfo) {
                        $scope.weixinWeb = true;
                    }

                    $scope.weixinWebPay = function () {
                        console.info(payChannelInfo);
                        PayService.prePay(payChannelInfo.payChannelId).success(function (result) {
                            console.info(result);
                            if (result.common.status != '0') {
                                return alert(result.common.desc);
                            } else {
                                // window.location.href = result.options.payChannelProtocol.mweb_url;
                                window.pageBridge.invokeSdkOpenNativePay(result.options.payChannelProtocol.url);
                            }
                        });
                    };

                    $scope.$on('PayTypeDirective:show', function (event, payChannel) {
                        if (payChannel.payChannelId == '210544000112000051014300') {
                            payChannelInfo = payChannel;
                            $scope.weixinWeb = true;
                        }
                    });
                }]
            }
        })


        /**
         * 网银支付
         */
        .directive('wangYinPay', function () {
            var payChannelInfo;
            return {
                restrict: 'AE',
                replace: true,
                // scope: {}, //创建隔离作用域
                /**
                 * 注意模板里面有国际化信息
                 */
                template: '<li ng-click="wangYinPay();" ng-if="wangYin"><a href="javascript:void(0);"><img src="http://content.gamebean.com/image/sdk/new/pay_icon02.png"/><span translate="v1_key9"><!--网银支付--></span></a></li>',
                controller: ['$scope', '$rootScope', 'PayService', function ($scope, $rootScope, PayService) {
                    payChannelInfo = !!$rootScope.payChannel ? $rootScope.payChannel['210640000112000051014300'] : '';
                    if (!!payChannelInfo) {
                        $scope.wangYin = true;
                    }

                    $scope.wangYinPay = function () {
                        console.info(payChannelInfo);
                        PayService.prePay(payChannelInfo.payChannelId).success(function (result) {
                            console.info(result);
                            if (result.common.status != '0') {
                                return alert(result.common.desc);
                            } else {
                                var url = result.options.payChannelProtocol.url;
                                var param = $.parseJSON(result.options.payChannelProtocol.params);
                                PayService.submitForm(url, param);
                            }
                        })
                    };

                    $scope.$on('PayTypeDirective:show', function (event, payChannel) {
                        if (payChannel.payChannelId == '210640000112000051014300') {
                            payChannelInfo = payChannel;
                            $scope.wangYin = true;
                        }
                    });
                }]
            }
        })


        /**
         * 支付宝WAP支付
         */
        .directive('zhifubaoWapPay', function () {
            var payChannelInfo;
            return {
                restrict: 'AE',
                replace: true,
                // scope: {}, //创建隔离作用域
                /**
                 * 注意模板里面有国际化信息
                 */
                template: '<li ng-click="zhifubaoWapPay();" ng-if="zhifubaoWap"><a href="javascript:void(0);"><img src="http://content.gamebean.com/image/sdk/new/pay_icon03.png"/><span translate="v1_key10"><!--支付宝WAP--></span></a></li>',
                controller: ['$scope', '$rootScope', 'PayService', function ($scope, $rootScope, PayService) {
                    payChannelInfo = $rootScope.payChannel ? $rootScope.payChannel['210391000112013551014300'] : '';
                    if (payChannelInfo) {
                        $scope.zhifubaoWap = true;
                    }

                    $scope.zhifubaoWapPay = function () {
                        console.info(payChannelInfo);
                        PayService.prePay(payChannelInfo.payChannelId).success(function (result) {
                            console.info(result);
                            if (result.common.status != '0') {
                                return alert(result.common.desc);
                            } else {
                                return window.location.href = result.options.payChannelProtocol.url;
                            }
                        })
                    };

                    $scope.$on('PayTypeDirective:show', function (event, payChannel) {
                        if (payChannel.payChannelId == '210391000112013551014300') {
                            payChannelInfo = payChannel;
                            $scope.zhifubaoWap = true;
                        }
                    });
                }]
            }
        })


        /**
         * 支付宝SDK支付
         */
        .directive('zhifubaoSdkPay', function () {
            var payChannelInfo;
            return {
                restrict: 'AE',
                replace: true,
                // scope: {}, //创建隔离作用域
                /**
                 * 注意模板里面有国际化信息
                 */
                template: '<li ng-click="zhifubaoSdkPay();" ng-if="zhifubaoSdk"><a href="javascript:void(0);"><a href="javascript:void(0);"><img src="http://content.gamebean.com/image/sdk/new/pay_icon04.png"/><span translate="v1_key11"><!--支付宝客户端--></span></a></li>',
                controller: ['$scope', '$rootScope', 'PayService', function ($scope, $rootScope, PayService) {
                    payChannelInfo = $rootScope.payChannel ? $rootScope.payChannel['210391000014013451014300'] : '';
                    if (payChannelInfo) {
                        $scope.zhifubaoSdk = true;
                    }

                    $scope.zhifubaoSdkPay = function () {
                        console.info(payChannelInfo);
                        PayService.prePay(payChannelInfo.payChannelId).success(function (result) {
                            console.info(result);
                            if (result.common.status != '0') {
                                return alert(result.common.desc);
                            } else {
                                window.pageBridge.invokeSdkOpenNativePay(result.options.payChannelProtocol.url);
                            }
                        })
                    };

                    $scope.$on('PayTypeDirective:show', function (event, payChannel) {
                        if (payChannel.payChannelId == '210391000014013451014300') {
                            payChannelInfo = payChannel;
                            $scope.zhifubaoSdk = true;
                        }
                    });
                }]
            }
        })


        /**
         * mo9支付
         */
        .directive('mo9Pay', function () {
            var payChannelInfo;
            return {
                restrict: 'AE',
                replace: true,
                // scope: {}, //创建隔离作用域
                /**
                 * 注意模板里面有国际化信息
                 */
                template: '<li ng-click="mo9Pay();" ng-if="mo9"><a href="javascript:void(0);"><a href="javascript:void(0);"><img src="http://content.gamebean.com/image/sdk/new/pay_icon06.png"/><span translate="v1_key13"><!--mo9钱包--></span></a></li>',
                controller: ['$scope', '$rootScope', 'PayService', function ($scope, $rootScope, PayService) {
                    payChannelInfo = $rootScope.payChannel ? $rootScope.payChannel['210549000012000051014300'] : '';
                    if (payChannelInfo) {
                        $scope.mo9 = true;
                    }

                    $scope.mo9Pay = function () {
                        console.info(payChannelInfo);
                        PayService.prePay(payChannelInfo.payChannelId).success(function (result) {
                            console.info(result);
                            if (result.common.status != '0') {
                                return alert(result.common.desc);
                            } else {
                                return window.location.href = result.options.payChannelProtocol.url;
                            }
                        })
                    };

                    $scope.$on('PayTypeDirective:show', function (event, payChannel) {
                        if (payChannel.payChannelId == '210549000012000051014300') {
                            payChannelInfo = payChannel;
                            $scope.mo9 = true;
                        }
                    });
                }]
            }
        })


        /**
         * 手机充值卡支付
         */
        .directive('phoneCardPay', function () {
            var payChannelInfo;
            return {
                restrict: 'AE',
                replace: true,
                // scope: {}, //创建隔离作用域
                /**
                 * 注意模板里面有国际化信息
                 */
                template: '<li ng-click="phoneCardPay();" ng-if="phoneCard"><a href="javascript:void(0);"><a href="javascript:void(0);"><img src="http://content.gamebean.com/image/sdk/new/pay_icon05.png"/><span translate="v1_key12"><!--充值卡支付--></span></a></li>',
                controller: ['$scope', '$rootScope', 'PayService', function ($scope, $rootScope, PayService) {
                    // '210489000012013651014300' 神州付充值卡（直连）_HTTP     (包含移动、联通、电信三种移动运营商的支付方式)
                    // '210640000212000051014300' 盛付通_手机卡支付             (包含移动、联通、电信三种移动运营商的支付方式)
                    payChannelInfo = $rootScope.payChannel ? $rootScope.payChannel['210489000012013651014300'] || $rootScope.payChannel['210640000212000051014300'] : '';
                    if (payChannelInfo) {
                        $scope.phoneCard = true;
                    }

                    $scope.phoneCardPay = function () {
                        console.info(payChannelInfo);
                        $rootScope.goto('pcenter/phone')
                    };

                    $scope.$on('PayTypeDirective:show', function (event, payChannel) {
                        if (payChannel.payChannelId == '210489000012013651014300' || payChannel.payChannelId == '210640000212000051014300') {
                            payChannelInfo = payChannel;
                            $scope.phoneCard = true;
                        }
                    });
                }]
            }
        })

})(angular);