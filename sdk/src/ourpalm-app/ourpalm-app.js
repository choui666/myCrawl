(function (window, angular) {

    angular.module('ourpalm-app', ['ngRoute', 'pascalprecht.translate', 'ngCookies', 'ourpalm-util', 'ourpalm-util-http', 'ourpalm-service-login', 'ourpalm-service-question', 'ourpalm-service-ucenter', 'ourpalm-service-pcenter'])

        .config(['$translateProvider', '$httpProvider', function ($translateProvider, $httpProvider) {
            /* 通过 angular-translate-loader-static-files 加载 */
            $translateProvider.useStaticFilesLoader({
                files: [{
                    prefix: 'i18n/locale-',
                    suffix: '.json'
                }]
            });
            /* 设置首选语言 */
            $translateProvider.preferredLanguage('zh_CN');
            /* 设置安全策略 */
            $translateProvider.useSanitizeValueStrategy('escaped');
            /* 设置超时 */
            $httpProvider.defaults.timeout = 3000;
        }])

        .config(['$routeProvider', function ($routeProvider) {

            $routeProvider

            /**
             * 计费中心
             */
                .when('/pcenter', {
                    redirectTo: '/pcenter/index'
                })
                .when('/pcenter/index', {
                    template: require('./../ourpalm-pcenter/views/index.html'),
                    resolve: {
                        initModule: ['Util', function (Util) {
                            return Util.initModule();
                        }],
                        initOrderInfo: ['PayService', function (PayService) {
                            return PayService.initOrderInfo();
                        }]
                    }
                })
                .when('/pcenter/phone', {
                    template: require('./../ourpalm-pcenter/views/phone.html'),
                })
                .when('/pcenter/paysuccess', {
                    template: require('./../ourpalm-pcenter/views/paysuccess.html'),
                })
                .when('/pcenter/payfailure', {
                    template: require('./../ourpalm-pcenter/views/payfailure.html')
                })


                /**
                 * 用户中心
                 */
                .when('/ucenter', {
                    redirectTo: '/ucenter/index'
                })
                .when('/ucenter/menu', { //菜单导航
                    template: require('./../ourpalm-ucenter/views/menu.html'),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/ucenter/index', { //用户中心首页
                    template: require('./../ourpalm-ucenter/views/index.html')
                })
                .when('/ucenter/changepassword', { //修改密码
                    template: require('./../ourpalm-ucenter/views/changepassword.html')
                })
                .when('/ucenter/changenickname', { //修改昵称
                    template: require('./../ourpalm-ucenter/views/changenickname.html')
                })
                .when('/ucenter/bindphone', { //绑定手机
                    template: require('./../ourpalm-ucenter/views/bindphone.html')
                })
                .when('/ucenter/rebindphone_tip', { //修改绑定手机 - 提示页面
                    template: require('./../ourpalm-ucenter/views/rebindphone_tip.html')
                })
                .when('/ucenter/unbindphone', { //解除绑定手机
                    template: require('./../ourpalm-ucenter/views/unbindphone.html')
                })
                .when('/ucenter/rebindphone', { //修改绑定手机
                    template: require('./../ourpalm-ucenter/views/rebindphone.html')
                })
                .when('/ucenter/upgrade', { //升级
                    template: require('./../ourpalm-ucenter/views/upgrade.html')
                })
                .when('/ucenter/find_password', { //找回密码
                    template: require('./../ourpalm-ucenter/views/find_password.html')
                })
                .when('/ucenter/find_password_phone', { //找回密码 - 手机找回
                    template: require('./../ourpalm-ucenter/views/find_password_phone.html')
                })
                .when('/ucenter/find_password_cs', { //找回密码 - 客服找回
                    template: require('./../ourpalm-ucenter/views/find_password_cs.html')
                })
                .when('/ucenter/mine_message', { //找回密码 - 客服找回
                    template: require('./../ourpalm-ucenter/views/mine_message.html')
                })


                /**
                 * 客服中心
                 */
                .when('/question', {
                    redirectTo: '/question/question_index'
                })
                .when('/question/question_index', { //客服中心首页
                    template: require('./../ourpalm-question/views/question_index.html'),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/question/question_mine', { //我的问题
                    template: require('./../ourpalm-question/views/question_mine.html')
                })
                .when('/question/question_ask', { //我要提问
                    template: require('./../ourpalm-question/views/question_ask.html')
                })
                .when('/question/question_detail', { //问题详情
                    template: require('./../ourpalm-question/views/question_detail.html')
                })
                .when('/question/question_append/:questionId', { //追加问题
                    template: require('./../ourpalm-question/views/question_append.html')
                })
                .when('/question/question_evaluation/:questionId', { //客服评价
                    template: require('./../ourpalm-question/views/question_evaluation.html')
                })
                .when('/question/question_type/:categoryId/:catetoryRelation', { //单个常见问题列表页
                    template: require('./../ourpalm-question/views/question_type.html')
                })
                .when('/question/question_type_detail', { //单个常见问题详情页
                    template: require('./../ourpalm-question/views/question_type_detail.html')
                })

                /**
                 * 用户登录
                 */
                .when('/login', { //首登
                    redirectTo: '/login/login_first'
                })
                .when('/login/login_first', { //首登
                    template: require('./../ourpalm-login/views/login_first.html'),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/login/login_switch', { //切换账号
                    template: require('./../ourpalm-login/views/login_switch.html'),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/login/login', { //登录
                    template: require('./../ourpalm-login/views/login.html')
                })
                .when('/login/login_bindphone', { //强绑手机
                    template: require('./../ourpalm-login/views/login_bindphone.html')
                })
                .when('/login/login_upgrade', { //账号升级
                    template: require('./../ourpalm-login/views/login_upgrade.html')
                })
                .when('/login/upgrade_tip', { //账号升级提示
                    template: require('./../ourpalm-login/views/upgrade_tip.html')
                })
                .when('/login/register', { //注册
                    template: require('./../ourpalm-login/views/register.html')
                })
                .when('/login/find_password', { //找回密码
                    template: require('./../ourpalm-login/views/find_password.html')
                })
                .when('/login/find_password_phone', { //找回密码 - 手机找回
                    template: require('./../ourpalm-login/views/find_password_phone.html')
                })
                .when('/login/find_password_cs', { //找回密码 - 通过客服
                    template: require('./../ourpalm-login/views/find_password_cs.html')
                })
                .when('/login/login_add', { //切换账号 - 添加新账号
                    template: require('./../ourpalm-login/views/login_add.html')
                })
                .when('/login/user_protocol', { //用户协议
                    template: require('./../ourpalm-login/views/user_protocol.html')
                })

                //提示
                .when('/login/login_prompt', {//提示入口
                    resolve: {
                        initLoginPrompt: ['Util', function (Util) {
                            return Util.initLoginPrompt();
                        }]
                    }
                })
                .when('/login/prompt_notice', { //公告
                    template: require('./../ourpalm-login/views/prompt_notice.html')
                })
                .when('/login/prompt_whitelist', { //白名单
                    template: require('./../ourpalm-login/views/prompt_whitelist.html')
                })
                .when('/login/prompt_update_version', { //版本更新
                    template: require('./../ourpalm-login/views/prompt_update_version.html')
                })
                .when('/login/prompt_cdkey', { //激活码
                    template: require('./../ourpalm-login/views/prompt_cdkey.html')
                })

                .otherwise({
                    redirectTo: '/login'
                });

        }])

        .run(['$rootScope', '$interval', '$translate', '$cookies', function ($rootScope, $interval, $translate, $cookies) {
            /* 检测路由变化的时候清除timer */
            $rootScope.$on('$locationChangeStart', function (event, url) {
                if (window.$timer) {
                    try {
                        $interval.cancel(window.$timer);
                    } catch (err) {
                        console.info(['路由变化时清除timer出错,请忽略', err]);
                    }
                }
                $rootScope.Global_$$_NotGetCaptcha = false;
                $rootScope.Global_$$_CaptchaTip = '';
                console.info(['$locationChangeStart', url]);
            });

            /* 设置国际化语言 */
            var key = $translate.proposedLanguage();
            window.pageBridge.applyCall(function () {
                var language = 'zh_CN';
                var localeId = angular.fromJson(window.pageBridge.getPcodeInfo()).localeId;
                switch (localeId) {
                    case '01':
                        language = 'zh_CN';
                        break;
                    case '02':
                        language = 'en_US';
                        break;
                }
                console.info(['当前的语言', key, '需要设置的语言', language]);
                if (language != key) {
                    $translate.use(language); //设置语言
                }
            });
        }])

        .controller('PageController', ['$scope', '$rootScope', '$window', 'toast', 'Util', function ($scope, $rootScope, $window, toast, Util) {
            $rootScope.title = 'SDK充值中心';

            $rootScope.back = function () {
                $window.history.back();
            };

            $rootScope.reload = function () {
                window.location.reload();
            };

            $rootScope.closeWebview = function (toast) {
                window.pageBridge && window.pageBridge.invokeSdkCloseWebiew(toast || '');
            };

            /**
             * 登录注册 模块 关闭 webview
             */
            $rootScope.closeWebview_Login = function () {
                if (window.pageBridge) {
                    window.pageBridge.invokeSdkLoginFinished($rootScope.normalLoginData || $rootScope.registerData || $rootScope.fastLoginData || {});
                }
            };

            $rootScope.exitApp = function () {
                window.pageBridge && window.pageBridge.invokeSdkQuitApp();
            };

            $rootScope.setTitle = function (title) {
                $rootScope.title = title;
            };

            $rootScope.goto = function (hash) {
                window.location.hash = '/' + hash;
            };

            $rootScope.toast = function (val) {
                toast(val);
            };

            $rootScope.isFastUserLogin = function (loginType) {
                return Util.isFastUserLogin(loginType);
            };
        }]);

})(window, angular);