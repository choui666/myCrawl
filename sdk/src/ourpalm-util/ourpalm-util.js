(function (window, angular) {

    Array.prototype.removeAt = function (index) {
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    angular.module('ourpalm-util', ['base64', 'ngAnimate', 'pascalprecht.translate', 'ngCookies'])

        .filter('phonemask', function () {
            return function (phone) {
                try {
                    return phone.substr(0, 4) + '***' + phone.substr(7, 4);
                } catch (err) {
                    return phone;
                }
            }
        })

        .filter('sce_trust', ['$sce', function ($sce) {
            return function (val) {
                return $sce.trustAsHtml(val);
            }
        }])

        .filter('substr', [function () {
            return function (val, limit, postfix) {
                if (!!val && val.length > limit) {
                    return val.substr(0, limit) + postfix;
                }
                return val;
            }
        }])

        .directive('ourpalmBack', [function () {
            return {
                restrict: 'A',
                scope: true,
                controller: ['$rootScope', '$scope', '$element', '$attrs', function ($rootScope, $scope, $element, $attrs) {
                    $element.bind('click', function (event) {
                        $scope.$apply(function () {
                            if (!!$attrs.ourpalmBack) {
                                $rootScope.Global_$$_BackFrom = $attrs.ourpalmBack;
                            }
                            window.history.back();
                        });
                    });
                }]
            }
        }])

        .directive('ourpalmReload', [function () {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, ele, attrs) {
                    ele.on('click', function () {
                        window.location.reload();
                    });
                }
            }
        }])

        .directive('ourpalmCloseWebview', [function () {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, ele, attrs) {
                    ele.on('click', function () {
                        window.pageBridge && window.pageBridge.invokeSdkCloseWebiew();
                    });
                }
            }
        }])

        .directive('ourpalmExitGame', [function () {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, ele, attrs) {
                    ele.on('click', function () {
                        window.pageBridge && window.pageBridge.invokeSdkQuitApp();
                    });
                }
            }
        }])

        .directive('ourpalmGoto', ['$timeout', '$window', function ($timeout, $window) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, ele, attrs) {
                    ele.on('click', function () {
                        window.location.hash = attrs.ourpalmGoto;
                    });
                }
            }
        }])

        .directive('ourpalmInputFocus', ['Util', '$timeout', function (Util, $timeout) {
            return {
                restrict: 'AE',
                scope: true,
                replace: true,
                template: function () {
                    if (Util.isIosDevice()) {
                        return '<div style="display:none;"><textarea class="ourpalm-input-focus-mask"></textarea><input type="text" class="ourpalm-input-focus-btn" value="完成"/></div>';
                    }
                    return '<div style="display:none;"><div class="ourpalm-input-focus-mask"></div><button class="ourpalm-input-focus-btn">完成</button></div>';
                },
                link: function (scope, ele, attrs) {
                    $(document).on('focus', '.input', function () {
                        $(this).each(function () {
                            var $this = $(this);
                            if (this.hasAttribute('readonly')) {
                                return;
                            }
                            if (Util.isIosDevice()) {
                                // $this.addClass('ourpalm-input-focus'); //不使用class选择器 会和设计师的class代码冲突
                                $this.attr('id', 'ourpalm-input-focus'); //用id选择器
                                $(ele).show();
                            } else {
                                $timeout(function () {
                                    // $this.addClass('ourpalm-input-focus');
                                    $this.attr('id', 'ourpalm-input-focus');
                                    $(ele).show();
                                });
                            }
                        });
                    }).on('focusout', '.input', function () {
                        var $this = $(this);
                        if ($(this).attr('readonly')) {
                            return;
                        }
                        if (Util.isIosDevice) {
                            window.pageBridge.invokeSdkCloseKeyboard(function () {
                                $this.each(function () {
                                    // $(this).removeClass('ourpalm-input-focus');
                                    $(this).removeAttr('id');
                                    $(ele).hide();
                                });
                            });
                        } else {
                            $(this).each(function () {
                                // $(this).removeClass('ourpalm-input-focus');
                                $(this).removeAttr('id');
                                $(ele).hide();
                            });
                        }
                    });
                }
            }
        }])

        .directive('ourpalmTextareaFocus', ['Util', '$timeout', function (Util, $timeout) {
            return {
                restrict: 'AE',
                scope: true,
                replace: true,
                template: function () {
                    if (Util.isIosDevice()) {
                        return '<div style="display:none;"><textarea class="ourpalm-textarea-focus-mask"></textarea><input class="ourpalm-textarea-focus-btn" value="完成"/></div>';
                    }
                    return '<div style="display:none;"><div class="ourpalm-textarea-focus-mask"></div><button class="ourpalm-textarea-focus-btn">完成</button></div>';
                },
                link: function (scope, ele, attrs) {
                    $(document).on('focus', 'textarea', function () {
                        $(this).each(function () {
                            var $this = $(this);
                            if (!$(this).attr('readonly')) {
                                if (Util.isIosDevice()) {
                                    // $(this).addClass('ourpalm-textarea-focus'); //不使用class选择器 会和设计师的class代码冲突
                                    $(this).attr('id', 'ourpalm-textarea-focus');
                                    $(ele).show();
                                } else {
                                    $timeout(function () {
                                        // $(this).addClass('ourpalm-textarea-focus'); //不使用class选择器 会和设计师的class代码冲突
                                        $this.attr('id', 'ourpalm-textarea-focus');
                                        $(ele).show();
                                    });
                                }
                            }
                        });
                    }).on('focusout', 'textarea', function () {
                        var $this = $(this);
                        if ($this.attr('readonly')) {
                            return;
                        }
                        if (Util.isIosDevice) {
                            window.pageBridge.invokeSdkCloseKeyboard(function () {
                                $this.each(function () {
                                    // $(this).removeClass('ourpalm-textarea-focus');
                                    $(this).removeAttr('id');
                                    $(ele).hide();
                                });
                            });
                        } else {
                            $(this).each(function () {
                                // $this.removeClass('ourpalm-textarea-focus');
                                $(this).removeAttr('id');
                                $(ele).hide();
                            });
                        }
                    });
                }
            }
        }])


        /**
         * loading mask
         */
        .factory('loading', ['$rootScope', function ($rootScope) {
            var loading = function () {
            };

            loading.show = function () {
                $rootScope.$broadcast('ourpalm-loading-add');
            };

            loading.hide = function () {
                $rootScope.$broadcast('ourpalm-loading-remove');
            };

            return loading;
        }])
        .directive('ourpalmLoading', [function () {
            return {
                replace: true,
                restrict: 'EA',
                scope: true,
                // template: '<div><div ng-repeat="loading in loading_arr" class="ourpalm-toast">{{toast.val}}</div></div>',
                template: '<div ng-show="count > 0"><div style="position:fixed;top:0px;left:0px;border:0px none;padding:0px;margin:0px;width:100%;height:100%;z-index:100;background:rgb(224, 236, 255) none repeat scroll 0% 0%;opacity:0;"></div><img src="http://content.gamebean.com/image/other/ajax_loading.gif" style="position:fixed;top:50%;left:50%;width:32px;height:32px;margin-top:-16px;margin-left:-16px;z-index:1001"/></div>',
                link: function (scope, elements, attrs) {
                    scope.count = 0;
                    scope.$on('ourpalm-loading-add', function () {
                        scope.count = scope.count + 1;
                    });
                    scope.$on('ourpalm-loading-remove', function () {
                        scope.count = scope.count - 1;
                    });
                }
            }
        }])


        /**
         * toast消息提示
         */
        .factory('toast', ['$rootScope', '$translate', function ($rootScope, $translate) {
            /* 处理普通文本 */
            var toast = function (val) {
                $rootScope.$broadcast('toast-new', val);
            };
            /* 处理国际化 文本*/
            toast.translate = function (translateId) {
                $translate(translateId).then(function (translation) {
                    $rootScope.$broadcast('toast-new', translation);
                }, function () {
                    $rootScope.$broadcast('toast-show', '处理国际化失败,国际化key为：' + translateId);
                });
            };
            /* sdktoast toast */
            toast.sdktoast = function (val) {
                window.pageBridge && window.pageBridge.invokeSdkNativeToast(val);
            };
            /* sdktoast toast + 国际化*/
            toast.sdktoast.translate = function (translateId) {
                $translate(translateId).then(function (translation) {
                    window.pageBridge && window.pageBridge.invokeSdkNativeToast(translation);
                }, function () {
                    window.pageBridge && window.pageBridge.invokeSdkNativeToast('处理国际化失败,国际化key为：' + translateId);
                });
            };
            return toast;
        }])
        .directive('ourpalmToast', ['$sce', '$timeout', function ($sce, $timeout) {
            return {
                replace: true,
                restrict: 'EA',
                scope: true,
                template: '<div><div ng-repeat="toast in toast_map" class="ourpalm-toast">{{toast.val}}</div></div>',
                link: function (scope, elements, attrs) {
                    scope.toast_map = [];
                    scope.$on('toast-new', function (event, val) {
                        var key = new Date().getTime() + Math.random();
                        var data = {key: key, val: val};
                        scope.toast_map.push(data);
                        $timeout(function () {
                            scope.toast_map.remove(data);
                        }, 2000);
                        // window.pageBridge.invokeSdkNativeToast(val);
                    });
                }
            }
        }])

        /**
         * 消息提示
         */
        .directive('ourpalmMessager', ['$timeout', function ($timeout) {
            return {
                restrict: 'EA',
                scope: true,
                template: function (element, attrs) {
                    element.addClass('ourpalm-shake').css('display', 'none');
                    element.append('{{message}}'); // element.append('<b ng-bind="message"></b>');
                },
                link: function ($scope, $element) {
                    var isShow = false;
                    $scope.$on('messager-show', function (event, val) {
                        console.info(val);
                        $scope.message = val;
                        $element.css('display', 'block');
                        if (!isShow) {
                            $timeout(function () {
                                $element.css('display', 'none');
                                isShow = false;
                            }, 3000);
                        }
                        isShow = true;
                    });
                }
            }
        }])
        .factory('messager', ['$rootScope', '$translate', function ($rootScope, $translate) {
            /* 处理普通文本 */
            var messager = function (val) {
                $rootScope.$broadcast('messager-show', val);
            };
            /* 处理国际化 文本*/
            messager.translate = function (translateId) {
                $translate(translateId).then(function (translation) {
                    $rootScope.$broadcast('messager-show', translation);
                }, function () {
                    $rootScope.$broadcast('messager-show', '处理国际化失败,国际化key为：' + translateId);
                });
            };
            return messager;
        }])

        /**
         * 弹出对话框
         */
        .directive('ourpalmDialog', ['$rootScope', function ($rootScope) {
            return {
                restrict: 'EA',
                scope: true,
                template: function ($element, $attrs) {
                    $element.css('display', 'none');
                },
                controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    $scope.close = function () {
                        $element.css('display', 'none');
                        $rootScope.$emit('ourpalm-dialog-close');
                    };
                    $scope.confirm = function () {
                        $element.css('display', 'none');
                        $rootScope.$emit('ourpalm-dialog-confirm');
                    };
                    $scope.$on('ourpalm-dialog-open', function () {
                        $element.css('display', 'block');
                    });
                }]
            }
        }])
        .factory('dialog', ['$rootScope', '$q', function ($rootScope, $q) {
            return function () {
                var deferred = $q.defer();
                $rootScope.$broadcast('ourpalm-dialog-open');
                $rootScope.$on('ourpalm-dialog-confirm', function () {
                    deferred.resolve();
                });
                $rootScope.$on('ourpalm-dialog-close', function () {
                    deferred.reject();
                });
                return deferred.promise;
            }
        }])

        /**
         * 图片展示
         */
        .directive('ourpalmPictureBoxSrc', ['picbox', '$timeout', function (picbox, $timeout) {
            return {
                restrict: 'A',
                scope: false,
                link: function ($scope, $element, $attrs) {
                    $element.on('click', function () {
                        $timeout(function () {
                            picbox($attrs.ourpalmPictureBoxSrc || $attrs.src);
                        });
                    });
                }
            }
        }])
        .directive('ourpalmPictureBox', [function () {
            return {
                restrict: 'EA',
                scope: true,
                replace: true,
                template: '<div class="pop-box" ng-show="vm.src" ng-click="vm.close();"><div class="pic-box"><span><img ng-src="{{vm.src}}"></span></div></div>',
                controllerAs: 'vm',
                controller: ['$scope', function ($scope) {
                    var vm = this;
                    vm.close = function () {
                        vm.src = '';
                    };

                    $scope.$on('open-pic-box', function (event, val) {
                        vm.src = val;
                    });
                }]
            }
        }])
        .factory('picbox', ['$rootScope', function ($rootScope) {
            return function (val) {
                $rootScope.$broadcast('open-pic-box', val);
            }
        }])

        .service('Util', ['$http', '$q', '$timeout', '$base64', '$rootScope', 'toast', '$cookieStore', function ($http, $q, $timeout, $base64, $rootScope, toast, $cookieStore) {
            var __pcodeInfo = {};
            var __gameInfo = {};
            var __orderInfo = {};
            var __userData = {};
            var __activateInfo = {}; //{ "activateCode":"WDEDS345YUI", "activateTokenId":"78998A51EF6C41CC20F286CED26FE5F4" }

            var __moduleInited = false;

            var core_url = 'http://223.202.94.183:9080/ucenter_core3.0/core';
            var entry_url = 'http://223.202.94.183:9080/ucenter_entry3.0/entry';

            /**
             * 是否是合法的手机号【默认为国内的手机号】
             */
            function checkPhone(mobile, locale) {
                if (isEmpty(mobile)) {
                    return false;
                }

                locale = locale || 'zh_CN';
                var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                switch (locale) {
                    case 'zh_TW':
                        reg = /^09([0-9]{8})$/;
                        break;
                }
                return reg.test(mobile) ? true : false;
            }

            /**
             * 检查是否是空字符串
             */
            function isEmpty(val) {
                return !!val ? ('' == $.trim(val) ? true : false) : true;
            }

            /**
             * 检查密码是否符合要求 | 6-14位，数字、字母组合
             */
            function checkPassword(password) {
                var reg = /^[a-z\d]{6,14}$/i;
                return reg.test(password);
            }

            /**
             * 检查账号是否符合要求 | 6-18位、数字、字母、"_"(账号不能是纯数字)
             * @param account
             */
            function checkAccount(account) {
                if (/^[0-9]*$ /.test(account)) { //如果是全数字 返回false
                    return false;
                }
                var reg = /^[a-z\d_]{6,18}/i;
                return reg.test(account);
            }

            /**
             * 是否是快登账号
             *
             * speedyLogin：快速登录
             * speedyRegister：快速注册
             * commonLogin：普通用户名登录
             * phoneLogin：手机登录
             * emailLogin：邮箱登录
             * commonRegister：普通注册
             * @param loginType
             */
            function isFastUserLogin(loginType) {
                switch (loginType) {
                    case 'speedyLogin': //快速登录
                    case 'speedyRegister': //快速注册
                        return true;
                }
                return false;
            }

            /**
             * JSONP 处理函数
             */
            function jsonp(url, data, conf) {
                console.info(['jsonp', url, data, conf]);
                var config = $.extend({mask: true, cache: false}, conf);
                var param = {};
                if (config.cache) {
                    param = $.extend({callback: 'JSON_CALLBACK'}, data || {});
                } else {
                    param = $.extend({callback: 'JSON_CALLBACK', JSONP_CURRENT_TIME: new Date().getTime()}, data || {});
                }
                param = $.param(param);
                console.info(url + '?' + param);
                return $http.jsonp(url + '?' + param, config || {});
            }

            function initPcodeInfo() {
                __pcodeInfo = angular.fromJson(window.pageBridge.getPcodeInfo());
            }

            function initGameInfo() {
                __gameInfo = angular.fromJson(window.pageBridge.getGameInfo());
            }

            function initUcenterUserInfo() {
                __userData = angular.fromJson(window.pageBridge.getUcenterUserInfo());
                var base64EncodedString = decodeURIComponent(__userData.userId);
                __userData.base64UserId = __userData.userId;
                try {
                    __userData.userId = $base64.decode(base64EncodedString);
                } catch (err) {
                    console.info(err);
                }
            }

            /**
             * 初始化 模块
             */
            function initModule() {
                var deferred = $q.defer();
                if (__moduleInited) {
                    $timeout(function () {
                        deferred.resolve();
                    })
                } else {
                    window.pageBridge.applyCall(function () {
                        window.pageBridge.invokeSdkGetActivateInfo(function (response) {
                            __activateInfo = response ? angular.fromJson(response) : {}; //初始化激活码
                            initUcenterUserInfo();
                            initGameInfo();
                            initPcodeInfo();
                            __moduleInited = true;
                            deferred.resolve();
                        });
                    });
                }
                return deferred.promise;
            }

            function getActivateInfo() {
                return __activateInfo;
            }

            function getPcodeInfo() {
                return __pcodeInfo;
            }

            function getGameInfo() {
                return __gameInfo;
            }

            function getUserData() {
                return __userData;
            }

            function getOrderInfo() {
                return __orderInfo;
            }

            /**
             * 初始化登录模块的提示框
             */
            function initLoginPrompt() {
                var deferred = $q.defer();
                window.pageBridge.applyCall(function () {
                    initUcenterUserInfo();
                    initGameInfo();
                    window.pageBridge.invokeSdkGetPromptInfo(function (data) {
                        var result = angular.fromJson(data);
                        $rootScope.Login_PromptBase_PromptInfo_$$_Question = result;
                        promptNextOrClose(4);
                    });
                });

                return deferred.promise;
            }

            /**
             * 提示信息4个页面跳转 公告（step：4）-->白名单（step：3）--->版本更新（step：2）--->激活码（step：1）
             * @param step
             */
            function promptNextOrClose(step) {
                var result = $rootScope.Login_PromptBase_PromptInfo_$$_Question;
                if (!!result.noticeInfo && result.noticeInfo.switch == '1' && step >= 4) {
                    return $rootScope.goto('login/prompt_notice');
                } else if (!!result.promptInfo && result.promptInfo.hasPromp == '1' && step >= 3) {
                    return $rootScope.goto('login/prompt_whitelist');
                } else if (!!result.gameUpdateInfo && result.gameUpdateInfo.updateType != '3' && step >= 2) {
                    return $rootScope.goto('login/prompt_update_version');
                } else if (!!result.activateCode && result.activateCode.switch == '1' && result.activateCode.openActivateWin == '1' && step >= 1) {
                    return $rootScope.goto('login/prompt_cdkey');
                } else {
                    $rootScope.closeWebview();
                }
            }

            function isIosDevice() {
                var devicePlatformId = angular.fromJson(window.pageBridge.getConfigs()).devicePlatformId;
                return devicePlatformId == '1' ? true : false;
            }

            /**
             * 向用户中心发送请求，通过SDK进行加解密
             */
            function sendRequest2UCenter(url, data) {
                console.info(['请求的明文数据为：', data]);
                var deferred = $q.defer();
                window.pageBridge.invokeSdkEncryptData(JSON.stringify(data), function (encodeData) {
                    console.info(['请求的密文数据为：', encodeData]);
                    $http({
                        url: url,
                        method: 'POST',
                        data: encodeData,
                        mask: true, //显示loading ajaxLoadingInterceptor
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (encodeResponse) {
                        console.info(['响应的密文数据为：', encodeResponse]);
                        window.pageBridge.invokeSdkDecodeData(encodeResponse, function (decodeResponse) {
                            console.info(['响应的明文数据为：', decodeResponse]);
                            try {
                                deferred.resolve(angular.fromJson(decodeResponse));
                            } catch (err) {
                                alert('JSON格式化响应明文失败：' + decodeResponse);
                                deferred.resolve(decodeResponse);
                            }
                        })
                    }).error(function () {
                        deferred.reject(arguments);
                    })
                });
                return deferred.promise;
            }

            function decryption(encodeResponse) {
                var deferred = $q.defer();
                window.pageBridge.applyCall(function () {
                    window.pageBridge.invokeSdkDecodeData(encodeResponse, function (decodeResponse) {
                        console.info(['响应的明文数据为：', decodeResponse]);
                        try {
                            deferred.resolve(angular.fromJson(decodeResponse));
                        } catch (err) {
                            alert('JSON格式化响应明文失败：' + decodeResponse);
                            deferred.resolve(decodeResponse);
                        }
                    });
                });
                return deferred.promise;
            }

            /**
             * 将快登用户 升级为 正式用户
             */
            function upgrade2NormalUser(username, password, sessionId) {
                var data = {
                    service: 'palm.platform.ucenter.bindUser',
                    sessionId: sessionId,
                    newUserName: username,
                    newUserPwd: password
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }
                    //成功
                    var resultData = {
                        isNeedBindPhone: result.data.isNeedBindPhone == '1' ? true : false,
                        bindTokenId: result.data.bindPhone.bindTokenId
                    };

                    deferred.resolve(resultData);
                });
                return deferred.promise;
            }

            function setStoreItem(key, value) {
                if (window.localStorage) {
                    window.localStorage.setItem(key, value);
                } else {
                    $cookieStore.put(key, value);
                }
            }

            function getStoreItem(key) {
                return window.localStorage ? window.localStorage.getItem(key) : $cookieStore.get(key);
            }

            return {
                core_url: core_url,
                entry_url: entry_url,

                initModule: initModule, //初始化 模块 [用户中心 客服中心 计费中心 登录模块]

                initLoginPrompt: initLoginPrompt, //初始化登录提示
                promptNextOrClose: promptNextOrClose, //提示信息跳转

                getPcodeInfo: getPcodeInfo,
                getGameInfo: getGameInfo,
                getOrderInfo: getOrderInfo,
                getUserData: getUserData,
                getActivateInfo: getActivateInfo,

                isIosDevice: isIosDevice,
                checkAccount: checkAccount,
                checkPhone: checkPhone,
                isEmpty: isEmpty,
                checkPassword: checkPassword,
                isFastUserLogin: isFastUserLogin,
                jsonp: jsonp,
                sendRequest2UCenter: sendRequest2UCenter,
                upgrade2NormalUser: upgrade2NormalUser,
                decryption: decryption,
                setStoreItem: setStoreItem,
                getStoreItem: getStoreItem
            }
        }]);

})(window, angular);