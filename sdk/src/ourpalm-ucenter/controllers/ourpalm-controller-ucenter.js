(function (angular) {

    angular.module('ourpalm-app')

    /**
     * 菜单页面 Controller
     */
        .controller('UCenter__MenuController', ['$rootScope', '$scope', 'UCenterService', 'Util', 'QuestionService', function ($rootScope, $scope, UCenterService, Util, QuestionService) {
            var vm = this;
            vm.status = false;

            QuestionService.getQuestionStatus().then(function () {
                vm.status = true;
            });

            vm.gotoIndex = function () {
                UCenterService.getCurrentLoginUser().then(function (user) {
                    if (Util.isFastUserLogin(user.loginType)) {
                        $rootScope.UCenterBase_UpgradeCtl_$$_PageComeFrom = 'ucenter/index'; //标记升级账号后页面 要去 首页
                        $rootScope.goto('ucenter/upgrade');
                    } else {
                        $rootScope.goto('ucenter/index');
                    }
                });
            };

            vm.gotoBindPhone = function () {
                UCenterService.getCurrentLoginUser().then(function (user) {
                    if (Util.isFastUserLogin(user.loginType)) {
                        $rootScope.UCenterBase_UpgradeCtl_$$_PageComeFrom = 'ucenter/bindphone'; //标记升级账号后页面 要去 绑定手机页面
                        $rootScope.goto('ucenter/upgrade');
                    } else if (Util.isEmpty(user.bindPhone)) { //如果用户没有绑定手机 - 进入绑定手机流程
                        $rootScope.goto('ucenter/bindphone');
                    } else { //如果用户绑定了手机 - 进入解绑手机流程
                        $rootScope.goto('ucenter/rebindphone_tip');
                    }
                });
            };
        }])


        /**
         * 首页 Controller
         */
        .controller('UCenter__IndexController', ['$rootScope', 'UCenterService', '$timeout', 'Util', function ($rootScope, UCenterService, $timeout, Util) {
            var vm = this;

            $timeout(function () {
                UCenterService.getCurrentLoginUser().then(function (user) {
                    vm.nickName = user.nickName;
                    vm.userName = user.userName;
                });
            });

            vm.gotoBindPhone = function () {
                UCenterService.getCurrentLoginUser().then(function (user) {
                    if (Util.isEmpty(user.bindPhone)) { //如果用户没有绑定手机 - 进入绑定手机流程
                        $rootScope.goto('ucenter/bindphone');
                    } else { //如果用户绑定了手机 - 进入解绑手机流程
                        $rootScope.goto('ucenter/rebindphone_tip');
                    }
                });
            };

        }])


        /**
         * 修改昵称
         */
        .controller('UCenter__ChangeNicknameController', ['$rootScope', 'UCenterService', 'toast', 'Util', 'messager', function ($rootScope, UCenterService, toast, Util, messager) {
            var vm = this;

            UCenterService.getCurrentLoginUser().then(function (user) {
                vm.nickName = user.nickName;
                vm.oldNickname = user.nickName;
            });

            vm.changeNickname = function () {
                if (Util.isEmpty(vm.nickName)) {
                    // toast.translate('login_t26_key1'); //昵称不能为空
                    return messager.translate('login_t26_key1'); //昵称不能为空
                }
                if (vm.nickName == vm.oldNickname) {
                    //   toast.translate('login_t26_key2'); //昵称未修改
                    return messager.translate('login_t26_key2'); //昵称未修改
                }

                UCenterService.changeNickname(vm.nickName).then(function () {
                    $rootScope.back();
                    toast.translate('login_t26_key3'); //昵称设置成功
                }, function (result) {
                    toast(result.errorDesc);
                });
            };
        }])


        /**
         * 修改密码
         */
        .controller('UCenter__ChangePasswordController', ['$rootScope', 'UCenterService', 'toast', 'Util', 'messager', function ($rootScope, UCenterService, toast, Util, messager) {
            var vm = this;
            vm.oldPassword = '';
            vm.newPassword = '';
            vm.rePassword = '';

            vm.changePassword = function () {
                if (Util.isEmpty(vm.oldPassword)) {
                    return messager.translate('login_t27_key1'); //原密码不能为空
                }
                if (Util.isEmpty(vm.newPassword)) {
                    return messager.translate('login_t27_key2'); //新密码不能为空
                }
                if (!Util.checkPassword(vm.newPassword)) {
                    return messager.translate('login_t27_key3'); //密码为6-14位,数字、字母组合
                }
                if (Util.isEmpty(vm.rePassword)) {
                    return messager.translate('login_t27_key4'); //确认新密码不能为空
                }
                if (vm.newPassword != vm.rePassword) {
                    return messager.translate('login_t27_key5'); //两次输入的密码不一致
                }

                UCenterService.changePassword(vm.oldPassword, vm.newPassword).then(function () {
                    UCenterService.notifySDKModifyPasswordSuccess(vm.newPassword);
                    toast.translate('login_t27_key6'); //密码设置成功
                    $rootScope.back();
                }, function (result) {
                    return messager(result.errorDesc);
                });
            }
        }])

        /**
         * 账号升级
         */
        .controller('UCenter__UpgradeController', ['$rootScope', 'UCenterService', 'toast', 'Util', '$timeout', 'messager', function ($rootScope, UCenterService, toast, Util, $timeout, messager) {
            var vm = this;

            $timeout(function () {
                vm.isShowPassword = true;
            });

            vm.toggleShowPassword = function () {
                vm.isShowPassword = !vm.isShowPassword;
            };

            vm.upgrade = function () {
                if (Util.isEmpty(vm.account)) {
                    return messager.translate('login_t36_key1'); //账号不能为空
                }
                if (!Util.checkAccount(vm.account)) {
                    return messager.translate('login_t36_key2'); //账号为6-18位,数字、字母、"_"
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t36_key3'); //密码不能为空
                }
                if (!Util.checkPassword(vm.password)) {
                    return messager.translate('login_t36_key4'); //密码为6-14位,数字、字母组合
                }
                UCenterService.upgrade2NormalUser(vm.account, vm.password).then(function () {
                    toast.translate('login_t36_key5'); //账号升级成功
                    if (Util.isEmpty($rootScope.UCenterBase_UpgradeCtl_$$_PageComeFrom)) { //判断页面是由那里跳过来的
                        $rootScope.goto('ucenter/index');
                    } else {
                        $rootScope.goto($rootScope.UCenterBase_UpgradeCtl_$$_PageComeFrom);
                        $rootScope.UCenter_BindPhoneCtl_$$_CanBack = false; //升级账号后进入绑定手机页面,此时绑定手机页面不能后退
                    }
                }, function (result) {
                    toast(result.errorDesc);
                    messager(result.errorDesc);
                });
            };
        }])


        /**
         * 找回密码
         */
        .controller('UCenter__FindPasswordController', ['$rootScope', 'UCenterService', 'toast', 'Util', 'LoginService', 'messager', function ($rootScope, UCenterService, toast, Util, LoginService, messager) {
            var vm = this;

            if (Util.isEmpty($rootScope.UCenter_FindPasswordCtl_$$_Account)) {
                UCenterService.getCurrentLoginUser().then(function (user) {
                    vm.account = user.userName;
                });
            } else {
                vm.account = $rootScope.UCenter_FindPasswordCtl_$$_Account;
            }

            vm.findPassword = function () {
                if (Util.isEmpty(vm.account)) {
                    return messager.translate('login_t28_key1'); //请输入账号或手机号
                }
                LoginService.getUserInfo(vm.account).then(function (user) {
                    $rootScope.UCenter_FindPasswordPhoneCtl_$$_Phone = user.phone;
                    $rootScope.goto('ucenter/find_password_phone');
                }, function () {//如果用户未绑定手机号
                    $rootScope.goto('ucenter/find_password_cs');
                })
            }
        }])


        /**
         * 找回密码 - 通过手机找回
         */
        .controller('UCenter__FindPasswordPhoneController', ['$rootScope', 'UCenterService', 'toast', 'Util', '$timeout', 'LoginService', '$interval', 'messager', '$translate', function ($rootScope, UCenterService, toast, Util, $timeout, LoginService, $interval, messager, $translate) {
            var vm = this;

            $timeout(function () {
                vm.phone = $rootScope.UCenter_FindPasswordPhoneCtl_$$_Phone;
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
                    messager.translate('login_t30_key1'); //验证码已发送至您手机!
                    toast.translate('login_t30_key1'); //验证码已发送至您手机!
                    countdown();
                });
            };

            /**
             * 倒计时
             */
            function countdown() {
                $translate(['login_t30_key2', 'login_t30_key3']).then(function (translations) {
                    var times = 60;
                    $rootScope.Global_$$_NotGetCaptcha = true;
                    $rootScope.Global_$$_CaptchaTip = times + translations['login_t30_key2']; //秒
                    window.$timer = $interval(function (count) {
                        $rootScope.Global_$$_CaptchaTip = (times - count) + translations['login_t30_key2']; //秒
                    }, 1000, times);
                    window.$timer.then(function () {
                        $rootScope.Global_$$_NotGetCaptcha = false;
                        $rootScope.Global_$$_CaptchaTip = translations['login_t30_key3']; //获取验证码
                        window.$timer = null;
                    });
                });
            }

            vm.onCaptchaChangedEvent = function () {
                if (vm.captcha.length == 6) {
                    LoginService.validateFindPasswordCaptcha(vm.captcha).then(function (tokenId) {
                        vm.tokenId = tokenId;
                    }, function () {
                        messager.translate('login_t30_key4'); //验证码不正确
                        toast.translate('login_t30_key4'); //验证码不正确
                    });
                }
            };

            vm.findPassword = function () {
                if (Util.isEmpty(vm.captcha)) {
                    return messager.translate('login_t30_key5'); //验证码不能为空
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t30_key6'); //新密码不能为空
                }
                if (!Util.checkPassword(vm.password)) {
                    return messager.translate('login_t30_key7'); //密码为6-14位,数字、字母组合
                }

                LoginService.findPassword(vm.password, vm.tokenId).then(function () {
                    toast.translate('login_t30_key8'); //密码设置成功
                    $rootScope.goto('ucenter/index');
                }, function (result) {
                    var msg = [result.errorDesc, '(', result.errorCode, ')'].join('');
                    toast(msg);
                    messager(msg);
                });
            };
        }])


        /**
         * 绑定手机
         */
        .controller('UCenter__BindPhoneController', ['$rootScope', 'LoginService', 'toast', 'Util', '$interval', 'UCenterService', 'messager', '$translate', function ($rootScope, LoginService, toast, Util, $interval, UCenterService, messager, $translate) {
            var vm = this;

            vm.back = function () {
                var canBack = $rootScope.UCenter_BindPhoneCtl_$$_CanBack;
                if (canBack) {
                    $rootScope.back();
                } else {
                    $rootScope.UCenter_BindPhoneCtl_$$_CanBack = true;
                    $rootScope.goto('ucenter/index');
                }
            };

            /**
             * 获取验证码
             */
            vm.getPhoneCaptcha = function () {
                if (validatePhone()) {
                    LoginService.sendBindPhoneCaptcha(vm.phone).then(function () {
                        toast.translate('login_t25_key1'); //验证码已发送至您手机!
                        countdown();
                    });
                }
            };

            /**
             * 绑定手机
             */
            vm.bindPhone = function () {
                if (!validatePhone() || !validateCaptcha()) {
                    return;
                }
                if (Util.isEmpty(vm.password)) {
                    toast.translate('login_t25_key2'); //请输入登录密码
                    return messager.translate('login_t25_key2'); //请输入登录密码
                }

                LoginService.validatePassword4BindPhone(vm.password).then(function (tokenId) {
                    LoginService.bindPhone(vm.captcha, tokenId).then(function () {
                        UCenterService.notifySDKBindPhoneOrMailSuccess(vm.phone).then(function () {
                            toast.translate('login_t25_key3'); //手机号绑定成功
                            messager.translate('login_t25_key3'); //手机号绑定成功
                            $rootScope.back();
                        }, function (result) {
                            messager(result.errorDesc);
                        });
                    }, function (result) {
                        messager(result.errorDesc);
                    });
                }, function (result) {
                    messager(result.errorDesc);
                });
            };

            /**
             * 倒计时
             */
            function countdown() {
                $translate(['login_t25_key4', 'login_t25_key5']).then(function (translations) {
                    var times = 60;
                    $rootScope.Global_$$_NotGetCaptcha = true;
                    $rootScope.Global_$$_CaptchaTip = times + translations['login_t25_key4']; //秒
                    window.$timer = $interval(function (count) {
                        $rootScope.Global_$$_CaptchaTip = (times - count) + translations['login_t25_key4']; //秒
                    }, 1000, times);
                    window.$timer.then(function () {
                        $rootScope.Global_$$_NotGetCaptcha = false;
                        $rootScope.Global_$$_CaptchaTip = translations['login_t25_key5']; //获取验证码
                        window.$timer = null;
                    });
                });
            }

            function validatePhone() {
                if (Util.isEmpty(vm.phone)) {
                    toast.translate('login_t25_key6'); //请输入手机号
                    messager.translate('login_t25_key6'); //请输入手机号
                    return false;
                } else if (!Util.checkPhone(vm.phone)) {
                    toast.translate('login_t25_key7'); //手机号不合法
                    messager.translate('login_t25_key7'); //手机号不合法
                    return false;
                }
                return true;
            }

            function validateCaptcha() {
                if (Util.isEmpty(vm.captcha)) {
                    toast.translate('login_t25_key8'); //验证码不能为空
                    messager.translate('login_t25_key8'); //验证码不能为空
                    return false;
                }
                return true;
            }
        }])


        /**
         * 绑定新手机 - 提示
         */
        .controller('UCenter__RebindPhoneTipController', ['$rootScope', 'LoginService', 'toast', 'Util', '$interval', 'UCenterService', function ($rootScope, LoginService, toast, Util, $interval, UCenterService) {
            var vm = this;

            UCenterService.getCurrentLoginUser().then(function (user) {
                vm.phone = user.bindPhone;
            });
        }])


        /**
         * 解绑手机
         */
        .controller('UCenter__UnbindPhoneTipController', ['$rootScope', 'LoginService', 'toast', 'Util', '$interval', 'UCenterService', 'messager', '$translate', function ($rootScope, LoginService, toast, Util, $interval, UCenterService, messager, $translate) {
            var vm = this;

            $rootScope.Global_$$_NotGetCaptcha = false;
            $rootScope.Global_$$_CaptchaTip = '';

            UCenterService.getCurrentLoginUser().then(function (user) {
                vm.phone = user.bindPhone;
                vm.getPhoneCaptcha();
            });

            /**
             * 获取验证码
             */
            vm.getPhoneCaptcha = function () {
                LoginService.sendUnbindPhoneCaptcha(vm.phone).then(function () {
                    toast.translate('login_t35_key1'); //验证码已发送至您手机!
                    countdown();
                });
            };

            /**
             * 倒计时
             */
            function countdown() {
                $translate(['login_t35_key2', 'login_t35_key3']).then(function (translations) {
                    var times = 60;
                    $rootScope.Global_$$_NotGetCaptcha = true;
                    $rootScope.Global_$$_CaptchaTip = times + translations['login_t35_key2']; //秒
                    window.$timer = $interval(function (count) {
                        $rootScope.Global_$$_CaptchaTip = (times - count) + translations['login_t35_key2']; //秒
                    }, 1000, times);
                    window.$timer.then(function () {
                        $rootScope.Global_$$_NotGetCaptcha = false;
                        $rootScope.Global_$$_CaptchaTip = translations['login_t35_key3']; //获取验证码
                        window.$timer = null;
                    });
                });
            }

            /**
             * 解绑手机
             */
            vm.unbindPhone = function () {
                if (Util.isEmpty(vm.captcha)) {
                    return messager.translate('login_t35_key4'); //验证码不能为空
                }
                if (Util.isEmpty(vm.password)) {
                    return messager.translate('login_t35_key5'); //请输入登录密码
                }
                LoginService.unBindPhone(vm.captcha, vm.password).then(function () {
                    //解绑成功 跳转到重新绑定页面
                    $rootScope.UCenter_RebindPhoneCtl_$$_Password = vm.password;
                    $rootScope.goto('ucenter/rebindphone');
                }, function (result) {
                    return messager(result.errorDesc);
                })
            };
        }])

        /**
         * 绑定新手机号
         */
        .controller('UCenter__RebindPhoneController', ['$rootScope', 'LoginService', 'toast', 'Util', '$interval', 'UCenterService', 'messager', '$translate', function ($rootScope, LoginService, toast, Util, $interval, UCenterService, messager, $translate) {
            var vm = this;
            vm.password = $rootScope.UCenter_RebindPhoneCtl_$$_Password;
            $rootScope.Global_$$_NotGetCaptcha = false;
            $rootScope.Global_$$_CaptchaTip = '';

            /**
             * 获取验证码
             */
            vm.getPhoneCaptcha = function () {
                if (Util.isEmpty(vm.phone)) {
                    return messager.translate('login_t33_key1'); //手机号不能为空
                }
                if (!Util.checkPhone(vm.phone)) {
                    return messager.translate('login_t33_key2'); //手机号不合法
                }
                LoginService.sendBindPhoneCaptcha(vm.phone).then(function () {
                    toast.translate('login_t33_key3'); //验证码已发送至您手机!
                    countdown();
                });
            };

            /**
             * 倒计时
             */
            function countdown() {
                $translate(['login_t33_key4', 'login_t33_key5']).then(function (translations) {
                    var times = 60;
                    $rootScope.Global_$$_NotGetCaptcha = true;
                    $rootScope.Global_$$_CaptchaTip = times + translations['login_t33_key4']; //秒
                    window.$timer = $interval(function (count) {
                        $rootScope.Global_$$_CaptchaTip = (times - count) + translations['login_t33_key4']; //秒
                    }, 1000, times);
                    window.$timer.then(function () {
                        $rootScope.Global_$$_NotGetCaptcha = false;
                        $rootScope.Global_$$_CaptchaTip = translations['login_t33_key5']; //获取验证码
                        window.$timer = null;
                    });
                });
            }

            vm.rebindPhone = function () {
                if (Util.isEmpty(vm.phone)) {
                    return messager.translate('login_t33_key6'); //请输入手机号
                }
                if (!Util.checkPhone(vm.phone)) {
                    return messager.translate('login_t33_key7'); //手机号不合法
                }
                if (Util.isEmpty(vm.captcha)) {
                    return messager.translate('login_t33_key8'); //验证码不能为空
                }

                LoginService.rebindPhone(vm.captcha, vm.password).then(function () {
                    UCenterService.notifySDKBindPhoneOrMailSuccess(vm.phone).then(function () {
                        toast.translate('login_t33_key9'); //手机号绑定成功
                        $rootScope.goto('ucenter/index');
                    }, function (result) {
                        messager(result.errorDesc);
                    });
                }, function (result) {
                    messager(result.errorDesc);
                });
            }
        }])
})(angular);