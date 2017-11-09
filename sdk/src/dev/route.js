(function (window, angular) {

    angular.module('ourpalm-app', ['ngRoute', 'pascalprecht.translate', 'ourpalm-util', 'ourpalm-util-http', 'ourpalm-service-login', 'ourpalm-service-question', 'ourpalm-service-ucenter', 'ourpalm-service-pcenter'])

        .config(['$translateProvider', '$httpProvider', function ($translateProvider, $httpProvider) {
            /* 通过 angular-translate-loader-static-files 加载 */
            $translateProvider.useStaticFilesLoader({
                files: [{
                    prefix: '/i18n/locale-',
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
                    templateUrl: '../ourpalm-pcenter/views/index.html?v=' + new Date().getTime(),
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
                    templateUrl: '../ourpalm-pcenter/views/phone.html?v=' + new Date().getTime()
                })
                .when('/pcenter/paysuccess', {
                    templateUrl: '../ourpalm-pcenter/views/paysuccess.html?v=' + new Date().getTime()
                })
                .when('/pcenter/payfailure', {
                    templateUrl: '../ourpalm-pcenter/views/payfailure.html?v=' + new Date().getTime()
                })


                /**
                 * 用户中心
                 */
                .when('/ucenter', {
                    redirectTo: '/ucenter/index'
                })
                .when('/ucenter/menu', { //菜单导航
                    templateUrl: '../ourpalm-ucenter/views/menu.html?v=' + new Date().getTime(),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/ucenter/index', { //用户中心首页
                    templateUrl: '../ourpalm-ucenter/views/index.html?v=' + new Date().getTime()
                })
                .when('/ucenter/changepassword', { //修改密码
                    templateUrl: '../ourpalm-ucenter/views/changepassword.html?v=' + new Date().getTime()
                })
                .when('/ucenter/changenickname', { //修改昵称
                    templateUrl: '../ourpalm-ucenter/views/changenickname.html?v=' + new Date().getTime()
                })
                .when('/ucenter/bindphone', { //绑定手机
                    templateUrl: '../ourpalm-ucenter/views/bindphone.html?v=' + new Date().getTime()
                })
                .when('/ucenter/rebindphone_tip', { //修改绑定手机 - 提示页面
                    templateUrl: '../ourpalm-ucenter/views/rebindphone_tip.html?v=' + new Date().getTime()
                })
                .when('/ucenter/unbindphone', { //解除绑定手机
                    templateUrl: '../ourpalm-ucenter/views/unbindphone.html?v=' + new Date().getTime()
                })
                .when('/ucenter/rebindphone', { //修改绑定手机
                    templateUrl: '../ourpalm-ucenter/views/rebindphone.html?v=' + new Date().getTime()
                })
                .when('/ucenter/upgrade', { //升级
                    templateUrl: '../ourpalm-ucenter/views/upgrade.html?v=' + new Date().getTime()
                })
                .when('/ucenter/find_password', { //找回密码
                    templateUrl: '../ourpalm-ucenter/views/find_password.html?v=' + new Date().getTime()
                })
                .when('/ucenter/find_password_phone', { //找回密码 - 手机找回
                    templateUrl: '../ourpalm-ucenter/views/find_password_phone.html?v=' + new Date().getTime()
                })
                .when('/ucenter/find_password_cs', { //找回密码 - 客服找回
                    templateUrl: '../ourpalm-ucenter/views/find_password_cs.html?v=' + new Date().getTime()
                })
                .when('/ucenter/mine_message', { //找回密码 - 客服找回
                    templateUrl: '../ourpalm-ucenter/views/mine_message.html?v=' + new Date().getTime()
                })


                /**
                 * 客服中心
                 */
                .when('/question', {
                    redirectTo: '/question/question_index'
                })
                .when('/question/question_index', { //客服中心首页
                    templateUrl: '../ourpalm-question/views/question_index.html?v=' + new Date().getTime(),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/question/question_mine', { //我的问题
                    templateUrl: '../ourpalm-question/views/question_mine.html?v=' + new Date().getTime()
                })
                .when('/question/question_ask', { //我要提问
                    templateUrl: '../ourpalm-question/views/question_ask.html?v=' + new Date().getTime()
                })
                .when('/question/question_detail', { //问题详情
                    templateUrl: '../ourpalm-question/views/question_detail.html?v=' + new Date().getTime()
                })
                .when('/question/question_append/:questionId', { //追加问题
                    templateUrl: '../ourpalm-question/views/question_append.html?v=' + new Date().getTime()
                })
                .when('/question/question_evaluation/:questionId', { //客服评价
                    templateUrl: '../ourpalm-question/views/question_evaluation.html?v=' + new Date().getTime()
                })
                .when('/question/question_type/:categoryId/:catetoryRelation', { //单个常见问题列表页
                    templateUrl: '../ourpalm-question/views/question_type.html?v=' + new Date().getTime()
                })
                .when('/question/question_type_detail', { //单个常见问题详情页
                    templateUrl: '../ourpalm-question/views/question_type_detail.html?v=' + new Date().getTime()
                })

                /**
                 * 用户登录
                 */
                .when('/login', { //首登
                    redirectTo: '/login/login_first'
                })
                .when('/login/login', { //登录
                    templateUrl: '../ourpalm-login/views/login.html?v=' + new Date().getTime()
                })
                .when('/login/login_first', { //首登
                    templateUrl: '../ourpalm-login/views/login_first.html?v=' + new Date().getTime(),
                    resolve: {
                        init: ['Util', function (Util) { 
                            return Util.initModule();
                        }]
                    }
                })
                .when('/login/login_switch', { //切换账号
                    templateUrl: '../ourpalm-login/views/login_switch.html?v=' + new Date().getTime(),
                    resolve: {
                        init: ['Util', function (Util) {
                            return Util.initModule();
                        }]
                    }
                })
                .when('/login/login_bindphone', { //强绑手机
                    templateUrl: '../ourpalm-login/views/login_bindphone.html?v=' + new Date().getTime()
                })
                .when('/login/login_upgrade', { //账号升级
                    templateUrl: '../ourpalm-login/views/login_upgrade.html?v=' + new Date().getTime()
                })
                .when('/login/upgrade_tip', { //账号升级提示
                    templateUrl: '../ourpalm-login/views/upgrade_tip.html?v=' + new Date().getTime()
                })
                .when('/login/register', { //注册
                    templateUrl: '../ourpalm-login/views/register.html?v=' + new Date().getTime()
                })
                .when('/login/find_password', { //找回密码
                    templateUrl: '../ourpalm-login/views/find_password.html?v=' + new Date().getTime()
                })
                .when('/login/find_password_phone', { //找回密码 - 手机找回
                    templateUrl: '../ourpalm-login/views/find_password_phone.html?v=' + new Date().getTime()
                })
                .when('/login/find_password_cs', { //找回密码 - 通过客服
                    templateUrl: '../ourpalm-login/views/find_password_cs.html?v=' + new Date().getTime()
                })
                .when('/login/login_add', { //切换账号 - 添加新账号
                    templateUrl: '../ourpalm-login/views/login_add.html?v=' + new Date().getTime()
                })
                .when('/login/user_protocol', { //用户协议
                    templateUrl: '../ourpalm-login/views/user_protocol.html'
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
                    templateUrl: '../ourpalm-login/views/prompt_notice.html?v=' + new Date().getTime()
                })
                .when('/login/prompt_whitelist', { //白名单
                    templateUrl: '../ourpalm-login/views/prompt_whitelist.html?v=' + new Date().getTime()
                })
                .when('/login/prompt_update_version', { //版本更新
                    templateUrl: '../ourpalm-login/views/prompt_update_version.html?v=' + new Date().getTime()
                })
                .when('/login/prompt_cdkey', { //激活码
                    templateUrl: '../ourpalm-login/views/prompt_cdkey.html?v=' + new Date().getTime()
                })
                .when('/login/thirdParty', { //激活码
                    templateUrl: '../ourpalm-login/views/prompt_thirdParty.html?v=' + new Date().getTime()
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