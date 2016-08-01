(function (angular) {

    angular.module('ourpalm-app')

    /**
     * 首登页面 Controller
     */
        .controller('Login__FirstLoginController', ['$scope', '$rootScope', 'LoginService', 'Util', '$location', 'toast', function ($scope, $rootScope, LoginService, Util, $location, toast) {
            /**
             *  b，快速登录
             第一步，调用SDK的invokeSdkGetFastLoginDeviceId接口获取deviceId；
             第二步，调用用户中心的快速登录接口进行登录；（中间需要先调用SDK的加密接口，返回后再调用SDK的解密接口）
             第三步，成功后，调用SDK的invokeSdkLoginSuccess接口进行同步SDK登录成功；

             登录返回中需要绑定手机走第五步；否则走第四步

             第四步，跳转至账号升级提示页面；用户再此点击忽略，关闭当前页面； 点击“升级账号”，则进入升级账号页面； 此时升级账号页面右上角可以点击X进行关闭页面；

             第五步，直接进入升级账号页面； 此时升级账号页面右上角没有关闭页面的X；

             第六步，输入账户密码和手机号码后，跳转至绑定手机页面； 如果登录返回中需要绑定手机则，手机号必填；

             第七步，跳转至绑定手机页面，输入验证码进行绑定手机；如果登录返回中需要绑定手机，则右下角不显示“暂不绑定”；  用户点击“暂不绑定”关闭页面；
             */
            $scope.fastLogin = function () {
                LoginService.fastLogin().then(function (loginedData) {
                    console.info('用户快登成功,用户信息为：' + JSON.stringify(loginedData));
                    // if (loginedData.needBindPhone == '1') { //需要绑定
                    if (false) { //需要绑定 //TODO 这里以前是需要走这个流程的，后来双迎又把流程给改了，为了防止这家伙流程总是改动，代码先留着吧。下面快登升级流程和这个一样
                        $rootScope.LoginUpgradeCtl_$$_needBindPhone = true; //提示需要绑定手机
                        $rootScope.LoginUpgradeCtl_$$_showBackBtn = false; //隐藏返回按钮
                        $rootScope.LoginUpgradeCtl_$$_showCloseBtn = false; //隐藏关闭按钮
                        $rootScope.goto('login/login_upgrade'); //进入升级账号页面
                    } else {
                        $rootScope.LoginUpgradeCtl_$$_needBindPhone = false; //提示不需要绑定手机
                        $rootScope.LoginUpgradeCtl_$$_showBackBtn = false; //隐藏返回按钮
                        $rootScope.LoginUpgradeCtl_$$_showCloseBtn = true; //显示关闭按钮
                        $rootScope.goto('login/upgrade_tip'); //进入升级提示页面
                    }
                }, function (result) {
                    toast(result.errorDesc);
                });
            };


            $scope.thirdPartyLogin = function (type) {
                Util.setStoreItem('thirdPartyFrom', 1);
                LoginService.thirdPartyLogin(type);
            }
        }])

        /**
         * 升级为正式账号 Controller
         */
        .controller('Login__LoginUpgradeController', ['$scope', '$rootScope', 'LoginService', 'Util', 'toast', '$timeout', 'messager', function ($scope, $rootScope, LoginService, Util, toast, $timeout, messager) {
            var vm = this;
            vm.account = ''; //邮箱 | 手机 | 用户名
            vm.password = ''; //密码
            vm.isShowPassword = true; //默认密码不可见
            vm.phone = ''; //手机号
            vm.isCheckPhone = true; //默认选中必填手机号
            vm.isCheckProtocol = true; //默认选中用户协议

            $timeout(function () {
                if ($rootScope.Global_$$_BackFrom == '/login/user_protocol') {
                    vm.account = $rootScope.Login__UpgradeCtl_$$_Account; //邮箱 | 手机 | 用户名
                    vm.password = $rootScope.Login__UpgradeCtl_$$_Password; //密码
                    vm.isShowPassword = $rootScope.Login__UpgradeCtl_$$_ShowPassword ? true : false;
                    vm.phone = $rootScope.Login__UpgradeCtl_$$_Phone; //手机号
                    vm.isCheckPhone = $rootScope.Login__UpgradeCtl_$$_CheckPhone ? true : false;
                    vm.isCheckProtocol = $rootScope.Login__UpgradeCtl_$$_CheckProtocol ? true : false;
                    $rootScope.Global_$$_BackFrom = '';
                }
            });

            vm.clearAccount = function () {
                vm.account = '';
            };

            vm.toggleShowPassword = function () {
                vm.isShowPassword = !vm.isShowPassword;
            };

            vm.onPhoneCheckboxChangedEvent = function () {
                if (!vm.isCheckPhone) {
                    vm.phone = ''; //清空手机号
                }
            };

            vm.gotoUserProtocol = function () {
                $rootScope.Login__UpgradeCtl_$$_ShowPassword = vm.isShowPassword;
                $rootScope.Login__UpgradeCtl_$$_CheckPhone = vm.isCheckPhone;
                $rootScope.Login__UpgradeCtl_$$_CheckProtocol = vm.isCheckProtocol;
                $rootScope.Login__UpgradeCtl_$$_Account = vm.account;
                $rootScope.Login__UpgradeCtl_$$_Password = vm.password;
                $rootScope.Login__UpgradeCtl_$$_Phone = vm.phone;
                $rootScope.goto('login/user_protocol');
            };

            vm.onPhoneChangedEvent = function () {
                if (!vm.isCheckPhone) {
                    vm.isCheckPhone = true; //选中手机号复选框
                }
            };

            vm.upgrade = function () {
                if (Util.isEmpty(vm.account)) {
                    return messager.translate('login_t11_key1'); //账号不能为空
                }
                if (!Util.checkAccount(vm.account)) {
                    return messager.translate('login_t11_key2'); //账号为6-18位,数字、字母、"_"
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t11_key3'); //密码不能为空
                }
                if (!Util.checkPassword(vm.password)) {
                    return messager.translate('login_t11_key4'); //密码为6-14位,数字、字母组合
                }
                if (vm.isCheckPhone) {
                    if (Util.isEmpty(vm.phone)) {
                        return messager.translate('login_t11_key5'); //请填写手机号，跳过请点掉对勾
                    }
                    if (!Util.checkPhone(vm.phone)) {
                        return messager.translate('login_t11_key6'); //手机号不合法
                    }
                }
                if (!vm.isCheckProtocol) {
                    return messager.translate('login_t11_key7'); //请同意掌趣用户注册协议
                }

                /**
                 * a.如果调用普通账户登录成功时返回的isNeedBindPhone为1，
                 *      则跳转至绑定手机页面，同时该页面的右下角不显示“暂不绑定”；如果用户在升级账户页面输入了手机号，则同时调用“发送手机验证码接口（该接口为没有绑定手机用户使用）”接口，下发验证码；输入验证码进行手机绑定；绑定完成后；直接关闭该页面，并toast提示“绑定成功！”；
                 * b.如果普通账户登录返回的isNeedBindPhone为0
                 *      如果用户没有输入手机号，则关闭页面，并toast提示“账号升级成功！”；
                 *      如果用户输入了手机号码，则跳转至绑定手机页面，同时该页面的右下角显示“暂不绑定”；则同时调用“发送手机验证码接口（该接口为没有绑定手机用户使用）”接口，下发验证码；输入验证码进行手机绑定；绑定完成后；直接关闭该页面，并toast提示“绑定成功！”；  点击“暂不绑定”直接关闭页面；
                 */
                LoginService.upgrade2NormalUser(vm.account, vm.password).then(function (result) {
                    if (result.isNeedBindPhone) { //需要绑定手机
                        $rootScope.LoginBindPhoneCtl_$$_Phone = vm.phone; //要绑定的手机号
                        $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = false; //不显示“暂不绑定”
                        $rootScope.goto('login/login_bindphone');
                    } else { //不需要绑定手机
                        if (Util.isEmpty(vm.phone)) {
                            //如果用户没有输入手机号，则关闭页面，并toast提示“账号升级成功！”；
                            toast.sdktoast.translate('login_t11_key8');  //账号升级成功
                            $rootScope.closeWebview_Login();
                        } else {
                            // 如果用户输入了手机号码，则跳转至绑定手机页面，同时该页面的右下角显示“暂不绑定”；则同时调用“发送手机验证码接口（该接口为没有绑定手机用户使用）”接口，下发验证码；输入验证码进行手机绑定；绑定完成后；直接关闭该页面，并toast提示“绑定成功！”；  点击“暂不绑定”直接关闭页面；
                            $rootScope.LoginBindPhoneCtl_$$_Phone = vm.phone; //要绑定的手机号
                            $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = true; //显示“暂不绑定”
                            $rootScope.goto('login/login_bindphone');
                        }
                    }
                }, function (result) {
                    return messager(result.errorDesc);
                });
            };
        }])


        /**
         * 绑定手机页面 Controller
         */
        .controller('Login__BindPhoneController', ['$scope', '$rootScope', 'LoginService', '$interval', 'Util', 'toast', '$timeout', '$translate', function ($scope, $rootScope, LoginService, $interval, Util, toast, $timeout, $translate) {
            var vm = this;

            $timeout(function () {
                vm.phone = $rootScope.LoginBindPhoneCtl_$$_Phone;
                vm.captcha = '';
                if (Util.checkPhone(vm.phone)) {
                    vm.getPhoneCaptcha();
                }
            });

            /**
             * 获取验证码
             */
            vm.getPhoneCaptcha = function () {
                if (validatePhone()) {
                    LoginService.sendBindPhoneCaptcha(vm.phone).then(function () {
                        toast.translate('login_t10_key1'); //验证码已发送至您手机!
                        countdown();
                    });
                }
            };

            /**
             * 倒计时
             */
            function countdown() {
                $translate(['login_t10_key2', 'login_t10_key3']).then(function (translations) {
                    var times = 60;
                    $rootScope.Global_$$_NotGetCaptcha = true;
                    $rootScope.Global_$$_CaptchaTip = times + translations['login_t10_key2']; //秒
                    window.$timer = $interval(function (count) {
                        $rootScope.Global_$$_CaptchaTip = (times - count) + translations['login_t10_key2']; //秒
                    }, 1000, times);
                    window.$timer.then(function () {
                        $rootScope.Global_$$_NotGetCaptcha = false;
                        $rootScope.Global_$$_CaptchaTip = translations['login_t10_key3']; //获取验证码
                        window.$timer = null;
                    });
                });
            }

            function validatePhone() {
                if (Util.checkPhone(vm.phone)) {
                    return true;
                } else {
                    toast.translate('login_t10_key4'); //请输入合法的手机号
                    return false;
                }
            }

            function validateCaptcha() {
                if ('' == vm.captcha) {
                    toast.translate('login_t10_key5'); //验证码不能为空
                    return false;
                }
                return true;
            }

            /**
             * 绑定手机
             */
            vm.bindPhone = function () {
                if (!validatePhone() || !validateCaptcha()) {
                    return;
                }

                // 绑定完成后；直接关闭该页面，并toast提示“绑定成功！”
                LoginService.bindPhone(vm.captcha).then(function () {
                    toast.sdktoast.translate('login_t10_key6'); //绑定成功！
                    $rootScope.closeWebview_Login(); //绑定成功！
                }, function (result) {
                    return toast(result.errorDesc);
                });


            };
        }])


        /**
         * 登录页面 Controller
         */
        .controller('Login__LoginController', ['$scope', '$rootScope', 'LoginService', 'Util', 'toast', 'messager', function ($scope, $rootScope, LoginService, Util, toast, messager) {
            var vm = this;

            vm.clearUsername = function () {
                vm.username = '';
            };
            vm.clearPassword = function () {
                vm.password = '';
            };
            vm.login = function () {
                if (Util.isEmpty(vm.username)) {
                    return messager.translate('login_t9_key1');
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t9_key2');
                }

                LoginService.normalUserLogin(vm.username, vm.password).then(function () {
                    $rootScope.closeWebview_Login();
                }, function (result) {
                    messager(result.errorDesc);
                });
            }
            vm.thirdPartyLogin = function (type) {
                Util.setStoreItem('thirdPartyFrom', 3);
                LoginService.thirdPartyLogin(type);
            }
        }])


        /**
         * 找回密码第一步页面 Controller
         */
        .controller('Login__FindPasswordStep1Controller', ['$scope', '$rootScope', 'LoginService', 'Util', 'messager', function ($scope, $rootScope, LoginService, Util, messager) {
            var vm = this;

            vm.account = $rootScope.FindPasswordStep1Ctl_$$_Account || '';

            vm.next = function () {
                if (Util.isEmpty(vm.account)) {
                    return messager.translate('login_t6_key1'); //请输入账号或手机号
                }

                LoginService.getUserInfo(vm.account).then(function (user) {//如果用户绑定了手机号
                    $rootScope.FindPasswordStep2Ctl_$$_Phone = user.phone;
                    $rootScope.FindPasswordStep2Ctl_$$_UserName = user.userName;
                    $rootScope.goto('login/find_password_phone');
                }, function (result) {//如果用户未绑定手机号
                    if (result.errorCode == '01010003') {
                        //错误码 01010003 代表用户未绑定手机号
                        $rootScope.goto('login/find_password_cs');
                    } else {
                        messager(result.errorDesc);
                    }
                })
            };
        }])

        /**
         * 找回密码第二步页面 Controller
         */
        .controller('Login__FindPasswordStep2Controller', ['$scope', '$rootScope', 'LoginService', 'Util', '$timeout', '$interval', 'messager', 'toast', '$translate', function ($scope, $rootScope, LoginService, Util, $timeout, $interval, messager, toast, $translate) {
            var vm = this;
            vm.userName = $rootScope.FindPasswordStep2Ctl_$$_UserName;

            $timeout(function () {
                vm.phone = $rootScope.FindPasswordStep2Ctl_$$_Phone;
                vm.isShowPassword = true; //默认密码不可见
                vm.captcha = '';
                if (Util.checkPhone(vm.phone)) {
                    vm.getPhoneCaptcha();
                }
            });

            /**
             * 获取验证码
             */
            vm.getPhoneCaptcha = function () {
                LoginService.sendFindPasswordCaptcha(vm.phone).then(function () {
                    messager.translate('login_t8_key1'); //验证码已发送至您手机!
                    toast.translate('login_t8_key1');
                    countdown();
                });
            };

            /**
             * 倒计时
             */
            function countdown() {
                var times = 60;
                $rootScope.Global_$$_NotGetCaptcha = true;
                $translate(['login_t8_key2', 'login_t8_key3']).then(function (translations) {
                    $rootScope.Global_$$_CaptchaTip = times + translations['login_t8_key2']; //秒
                    window.$timer = $interval(function (count) {
                        $rootScope.Global_$$_CaptchaTip = (times - count) + translations['login_t8_key2']; //秒
                    }, 1000, times);
                    window.$timer.then(function () {
                        $rootScope.Global_$$_NotGetCaptcha = false;
                        $rootScope.Global_$$_CaptchaTip = translations['login_t8_key3']; //获取验证码
                        window.$timer = null;
                    });
                });
            }

            vm.toggleShowPassword = function () {
                vm.isShowPassword = !vm.isShowPassword;
            };

            vm.onCaptchaChangedEvent = function () {
                if (vm.captcha.length == 6) {
                    LoginService.validateFindPasswordCaptcha(vm.captcha).then(function (tokenId) {
                        vm.tokenId = tokenId;
                    }, function () {
                        messager.translate('login_t8_key4'); //验证码不正确
                        toast.translate('login_t8_key4'); //验证码不正确
                    });
                }
            };

            vm.findPassword = function () {
                if (Util.isEmpty(vm.captcha)) {
                    return messager.translate('login_t8_key5'); //验证码不能为空
                }
                if (vm.captcha.length != 6) {
                    return messager.translate('login_t8_key4'); //验证码不正确
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t8_key6'); //新密码不能为空
                }
                if (!Util.checkPassword(vm.password)) {
                    return messager.translate('login_t8_key7'); //新密码为6-14位,数字、字母组合
                }

                LoginService.findPasswordAndAutoLogin(vm.userName, vm.password, vm.tokenId).then(function (result) {
                    if (result.isNeedBindPhone) { //需要绑定手机
                        //登录成功，且返回需要绑定手机，如果该账户没有绑定手机号，则进入绑定手机页面（此时绑定手机页面的右下角不显示“暂不绑定”）；
                        $rootScope.LoginBindPhoneCtl_$$_Phone = vm.phone; //要绑定的手机号
                        $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = false; //不显示“暂不绑定”
                        $rootScope.goto('login/login_bindphone');
                    } else { //不需要绑定手机
                        //登录成功，且返回不需要绑定手机则，toast提示“密码设置成功”
                        toast.sdktoast.translate('login_t8_key8'); //密码设置成功
                        $rootScope.closeWebview_Login();
                    }
                }, function (result) {
                    return messager(result.errorDesc);
                });
            };
        }])


        /**
         * 注册账号页面 Controller
         */
        .controller('Login__RegisterController', ['$scope', '$rootScope', 'LoginService', 'Util', '$timeout', 'messager', function ($scope, $rootScope, LoginService, Util, $timeout, messager) {
            var vm = this;
            vm.account = ''; //用户名
            vm.password = ''; //密码
            vm.isShowPassword = true; //默认密码不可见
            vm.phone = ''; //手机号
            vm.isCheckPhone = true; //默认选中必填手机号
            vm.isCheckProtocol = true; //默认选中用户协议

            $timeout(function () {
                if ($rootScope.Global_$$_BackFrom == '/login/user_protocol') {
                    vm.account = $rootScope.Login__RegisterCtl_$$_Account; //邮箱 | 手机 | 用户名
                    vm.password = $rootScope.Login__RegisterCtl_$$_Password; //密码
                    vm.isShowPassword = $rootScope.Login__RegisterCtl_$$_ShowPassword ? true : false;
                    vm.phone = $rootScope.Login__RegisterCtl_$$_Phone; //手机号
                    vm.isCheckPhone = $rootScope.Login__RegisterCtl_$$_CheckPhone ? true : false;
                    vm.isCheckProtocol = $rootScope.Login__RegisterCtl_$$_CheckProtocol ? true : false;
                    $rootScope.Global_$$_BackFrom = '';
                }
            });

            vm.clearAccount = function () {
                vm.account = '';
            };

            vm.toggleShowPassword = function () {
                vm.isShowPassword = !vm.isShowPassword;
            };

            vm.onPhoneCheckboxChangedEvent = function () {
                if (!vm.isCheckPhone) {
                    vm.phone = ''; //清空手机号
                }
            };

            vm.onPhoneChangedEvent = function () {
                if (!vm.isCheckPhone) {
                    vm.isCheckPhone = true; //选中手机号复选框
                }
            };

            vm.gotoUserProtocol = function () {
                $rootScope.Login__RegisterCtl_$$_ShowPassword = vm.isShowPassword;
                $rootScope.Login__RegisterCtl_$$_CheckPhone = vm.isCheckPhone;
                $rootScope.Login__RegisterCtl_$$_CheckProtocol = vm.isCheckProtocol;
                $rootScope.Login__RegisterCtl_$$_Account = vm.account;
                $rootScope.Login__RegisterCtl_$$_Password = vm.password;
                $rootScope.Login__RegisterCtl_$$_Phone = vm.phone;
                $rootScope.goto('login/user_protocol');
            };

            vm.register = function () {
                if (Util.isEmpty(vm.account)) {
                    return messager.translate('login_t4_key1'); //账号不能为空
                }
                if (!Util.checkAccount(vm.account)) {
                    return messager.translate('login_t4_key2'); //账号为6-18位,数字、字母、"_"
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t4_key3'); //密码不能为空
                }
                if (!Util.checkPassword(vm.password)) {
                    return messager.translate('login_t4_key4'); //密码为6-14位,数字、字母组合
                }
                if (vm.isCheckPhone) {
                    if (Util.isEmpty(vm.phone)) {
                        return messager.translate('login_t4_key5'); //请填写手机号，跳过请点掉勾选
                    }
                    if (!Util.checkPhone(vm.phone)) {
                        return messager.translate('login_t4_key6'); //手机号不合法
                    }
                }
                if (!vm.isCheckProtocol) {
                    return messager('login_t4_key7'); //请同意掌趣用户注册协议
                }

                LoginService.registerUser(vm.account, vm.password).then(function (result) {
                    if (result.isNeedBindPhone) { //需要绑定手机
                        $rootScope.LoginBindPhoneCtl_$$_Phone = vm.phone; //要绑定的手机号
                        $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = false; //不显示“暂不绑定”
                        $rootScope.goto('login/login_bindphone');
                    } else { //不需要绑定手机
                        if (Util.isEmpty(vm.phone)) {
                            //如果用户没有输入手机号，则关闭页面，并toast提示“账号升级成功！”；
                            $rootScope.closeWebview_Login();
                        } else {
                            // 如果用户输入了手机号码，则跳转至绑定手机页面，同时该页面的右下角显示“暂不绑定”；则同时调用“发送手机验证码接口（该接口为没有绑定手机用户使用）”接口，下发验证码；输入验证码进行手机绑定；绑定完成后；直接关闭该页面，并toast提示“绑定成功！”；  点击“暂不绑定”直接关闭页面；
                            $rootScope.LoginBindPhoneCtl_$$_Phone = vm.phone; //要绑定的手机号
                            $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = true; //显示“暂不绑定”
                            $rootScope.goto('login/login_bindphone');
                        }
                    }
                }, function (result) {
                    messager(result.errorDesc);
                });
            };
        }])


        /**
         * 切换用户页面 Controller
         */
        .controller('Login__SwitchController', ['$scope', '$rootScope', 'LoginService', '$timeout', 'Util', 'toast', 'dialog', function ($scope, $rootScope, LoginService, $timeout, Util, toast, dialog) {
            var vm = this;
            vm.open = false;
            vm.users = [];
            vm.userNum = 0;
            vm.currentUser = {};

            $timeout(function () {
                LoginService.getLoginedUsers().then(function (users) {
                    vm.users = users;
                    vm.userNum = vm.users.length;
                    if (vm.users.length == 0) {
                        $rootScope.goto('login/login_first');
                    } else {
                        vm.setCurrentUser(vm.users[0]);
                    }
                });
            });

            vm.toggleSelect = function ($event) {
                $event && $event.stopPropagation();//阻止事件冒泡
                vm.open = !vm.open;
            };

            vm.closeSelect = function ($event) {
                $event && $event.stopPropagation();//阻止事件冒泡
                if (vm.open) {
                    vm.toggleSelect($event);
                }
            };

            vm.deleteUser = function (index, $event) {
                $event && $event.stopPropagation(); //阻止事件传播

                dialog().then(function () {
                    //删除SDK
                    LoginService.deleteUserRecord(vm.users[index].userId).then(function () {
                        vm.users = vm.users.slice(0, index).concat(vm.users.slice(index + 1, vm.users.length)); //删除view
                        vm.userNum = vm.users.length;
                        if (vm.users.length != 0) {
                            vm.setCurrentUser(vm.users[0]); //重新选择第一个
                        } else {
                            $rootScope.goto('login/login_first');
                        }
                    });
                });
            };

            vm.setCurrentUser = function (user) {
                vm.currentUser = user;
                vm.isFastLoginUser = Util.isFastUserLogin(vm.currentUser.loginType);
            };

            vm.selectUser = function (index) {
                vm.setCurrentUser(vm.users[index]);
                vm.toggleSelect();
            };

            vm.gotoUpgrade = function () {
                $rootScope.LoginUpgradeCtl_$$_showBackBtn = true;
                $rootScope.goto('login/login_upgrade');
            };

            vm.gotoFindPassword = function () {
                if (Util.isFastUserLogin(vm.currentUser.loginType)) {
                    $rootScope.FindPasswordStep1Ctl_$$_Account = '';
                } else {
                    $rootScope.FindPasswordStep1Ctl_$$_Account = vm.currentUser.userName;
                }
                $rootScope.goto('login/find_password');
            };

            vm.login = function () {
                if (Util.isFastUserLogin(vm.currentUser.loginType)) {
                    vm.fastLogin();
                } else {
                    vm.normalLogin();
                }
            };

            /**
             * 正常登录
             * {"status": "0", "data": ""}
             */
            vm.normalLogin = function () {
                // LoginService.normalUserLogin(vm.currentUser.userName, vm.currentUser.password).then(loginSuccess);
                LoginService.normalUserLoginBySDK(vm.currentUser.userId).then(loginSuccess, function (result) {
                    if (result.errorCode == '01020003') {
                        $rootScope.Login_SwitchNewUserCtl_$$_Account = vm.currentUser.userName;
                        $rootScope.goto('login/login_add');
                    }
                    toast(result.errorDesc);
                });
            };

            /**
             * 快登登录
             */
            vm.fastLogin = function () {
                LoginService.fastLogin(vm.currentUser.deviceId).then(function (result) {
                    // if (result.isNeedBindPhone) { //需要绑定手机
                    if (false) { //需要绑定手机 //TODO 同上
                        $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = false; //不显示“暂不绑定”
                        $rootScope.goto('login/login_bindphone');
                    } else { //不需要绑定手机
                        $rootScope.LoginUpgradeCtl_$$_needBindPhone = false; //提示不需要绑定手机
                        $rootScope.LoginUpgradeCtl_$$_showBackBtn = false; //隐藏返回按钮
                        $rootScope.LoginUpgradeCtl_$$_showCloseBtn = true; //显示关闭按钮
                        $rootScope.goto('login/upgrade_tip'); //进入升级提示页面
                    }
                });
            };

            vm.thirdPartyLogin = function (type) {
                Util.setStoreItem('thirdPartyFrom', 2);
                LoginService.thirdPartyLogin(type);
            }

            /**
             * 正常登录 | 快登登录  回调处理
             */
            function loginSuccess(result) {
                if (result.isNeedBindPhone) { //需要绑定手机
                    $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = false; //不显示“暂不绑定”
                    $rootScope.goto('login/login_bindphone');
                } else { //不需要绑定手机
                    $rootScope.closeWebview_Login();
                }
            }
        }])


        /**
         * 切换账号 - 新账号 Controller
         */
        .controller('Login__SwitchNewUserController', ['$scope', '$rootScope', 'LoginService', 'Util', 'toast', 'messager', function ($scope, $rootScope, LoginService, Util, toast, messager) {
            var vm = this;
            vm.account = $rootScope.Login_SwitchNewUserCtl_$$_Account; //获取带过来的用户名
            $rootScope.Login_SwitchNewUserCtl_$$_Account = ''; //获取后将用户名置空

            vm.clearAccount = function () {
                vm.account = '';
            };

            vm.clearPassword = function () {
                vm.password = '';
            };

            vm.gotoFindPassword = function () {
                if (!!vm.currentUser && Util.isFastUserLogin(vm.currentUser.loginType)) {
                    $rootScope.FindPasswordStep1Ctl_$$_Account = '';
                } else {
                    $rootScope.FindPasswordStep1Ctl_$$_Account = vm.account;
                }
                $rootScope.goto('login/find_password');
            };

            vm.fastLogin = function () {
                LoginService.fastLogin().then(function () {
                    $rootScope.LoginUpgradeCtl_$$_needBindPhone = false; //提示不需要绑定手机
                    $rootScope.LoginUpgradeCtl_$$_showBackBtn = false; //隐藏返回按钮
                    $rootScope.LoginUpgradeCtl_$$_showCloseBtn = true; //显示关闭按钮
                    $rootScope.goto('login/upgrade_tip'); //进入升级提示页面
                });
            };

            vm.normalLogin = function () {
                if (Util.isEmpty(vm.account)) {
                    return messager.translate('login_t3_key1'); //账号不能为空
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t3_key2'); //密码不能为空
                }

                LoginService.normalUserLogin(vm.account, vm.password).then(function (result) {
                    if (result.isNeedBindPhone) { //需要绑定手机
                        $rootScope.LoginBindPhoneCtl_$$_ShowZBBD = false; //不显示“暂不绑定”
                        $rootScope.goto('login/login_bindphone');
                    } else { //不需要绑定手机
                        $rootScope.closeWebview_Login();
                    }
                }, function (result) {
                    messager(result.errorDesc);
                });
            };
        }])

        /**
         * 提示：公告页面 Controller
         */
        .controller('Login__PromptNoticeController', ['$scope', '$rootScope', 'Util', 'LoginService', function ($scope, $rootScope, Util, LoginService) {
            var vm = this;

            LoginService.getPromptNotice().then(function (content) {
                vm.content = content;
            });

            vm.closeOrNext = function () {
                Util.promptNextOrClose(3);
            };
        }])


        /**
         * 提示：白名单 Controller
         */
        .controller('Login__PromptWhitelistController', ['$scope', '$rootScope', 'Util', function ($scope, $rootScope, Util) {
            var vm = this;
            vm.message = $rootScope.Login_PromptBase_PromptInfo_$$_Question.promptInfo.message;
            vm.type = $rootScope.Login_PromptBase_PromptInfo_$$_Question.promptInfo.type;

            vm.closeOrNext = function () {
                Util.promptNextOrClose(2);
            };
        }])


        /**
         * 提示：版本更新 Controller
         */
        .controller('Login__PromptUpdateVersionController', ['$scope', '$rootScope', 'Util', 'LoginService', 'toast', function ($scope, $rootScope, Util, LoginService, toast) {
            var vm = this;
            vm.info = $rootScope.Login_PromptBase_PromptInfo_$$_Question.gameUpdateInfo;
            vm.notShow = false;

            vm.closeOrNext = function () {
                if (!!vm.notShow) {
                    LoginService.setNoUpdatePrompt(vm.info.version);
                }
                Util.promptNextOrClose(1);
            };

            /**
             * 升级游戏
             */
            vm.upgradeGame = function () {
                LoginService.upgradeGamePkg(vm.info.updateUrl, vm.info.fileSize).then(function () {
                    //通知SDK升级成功
                    if (vm.info.updateType != '1') { //1：强制更新 2：建议更新 3：不更新
                        Util.promptNextOrClose(1);
                    }
                }, function () {
                    //通知SDK升级失败
                });
            };
        }])



        /**
         * 提示：版本更新 Controller
         */
        .controller('Login__PromptCDKeyController', ['$scope', '$rootScope', 'Util', 'LoginService', 'toast', 'messager', function ($scope, $rootScope, Util, LoginService, toast, messager) {
            var vm = this;
            vm.cdkey = '';

            vm.clearCDKey = function () {
                vm.cdkey = '';
            };

            vm.activate = function () {
                if (Util.isEmpty(vm.cdkey)) {
                    return messager.translate('login_t12_key1'); //激活码不能为空
                }
                LoginService.activateUser(vm.cdkey).then(function () {
                    toast.translate('login_t12_key2'); //激活成功
                    $rootScope.closeWebview();
                }, function (result) {
                    messager(result.errorDesc);
                });
            };
        }])


        /**
         * 升级提示页面 Controller
         */
        .controller('Login__UpgradeTipController', ['$scope', '$rootScope', 'LoginService', function ($scope, $rootScope, LoginService) {


        }])

        /**
         * 升级提示页面 Controller
         */
        .controller('Login__PromptThirdController', ['$scope', '$rootScope', 'LoginService', 'Util', '$location', function ($scope, $rootScope, LoginService, Util, $location) {
            var vm = this;
            vm.popShow = false;

            vm.go = function () {
                $rootScope.goto(vm.gotoUrl);
            };

            Util.decryption($location.search().data).then(function (result) {
                console.log('Util.decryption', result);
                var from = Util.getStoreItem('thirdPartyFrom');
                vm.content = result.errorDesc;
                console.log('Util.from', from);

                LoginService.finishedThirdPartyLogin(result).then(function () {
                    $rootScope.goto('login/upgrade_tip');
                }, function () {
                    vm.popShow = true;
                    if (from == 1) {
                        vm.gotoUrl = 'login/login_first';
                    } else {
                        vm.gotoUrl = 'login/login_switch';
                    }
                });
            });
        }])

})(angular);