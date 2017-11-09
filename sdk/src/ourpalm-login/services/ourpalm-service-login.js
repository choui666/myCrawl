(function (window, angular) {
    /**
     * 登录模块 所有service
     */
    angular.module('ourpalm-service-login', ['ourpalm-util', 'ourpalm-util-http'])

        .config(['$httpProvider', function ($httpProvider) {
            //配置$http
            $httpProvider.interceptors.push('ajaxLoadingInterceptor');
            $httpProvider.interceptors.push('httpErrorInterceptor');
        }])

        .service('LoginService', ['$http', '$q', '$rootScope', '$timeout', 'Util', 'toast', '$location', function ($http, $q, $rootScope, $timeout, Util, toast, $location) {
            var core_url = 'http://223.202.94.183:9080/ucenter_core3.0/core';
            var entry_url = 'http://223.202.94.183:9080/ucenter_entry3.0/entry';

            /**
             * 向用户中心发送请求，通过SDK进行加解密
             */
            function sendRequest2UCenter(url, data) {
                var deferred = $q.defer();
                console.info(['请求的明文数据为：', data]);
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

            /**
             * 获取deviceId
             */
            function getDeviceId(deviceId) {
                var deferred = $q.defer();
                deviceId || ($rootScope.normalLoginData && $rootScope.normalLoginData.deviceId && (deviceId = $rootScope.normalLoginData.deviceId));
                deviceId || ($rootScope.fastLoginData && $rootScope.fastLoginData.deviceId && (deviceId = $rootScope.fastLoginData.deviceId));
                deviceId && $timeout(function () {
                    deferred.resolve(deviceId);
                });
                deviceId || window.pageBridge.invokeSdkGetFastLoginDeviceId(function (deviceIdInfo) {
                    deferred.resolve(angular.fromJson(deviceIdInfo).deviceId);
                });
                return deferred.promise;
            }

            /**
             * 快登账号登录
             */
            function fastUserLogin(deviceId) {
                var deferred = $q.defer();
                getDeviceId(deviceId).then(function (deviceId) {
                    sendRequest2UCenter(entry_url, {
                        service: 'palm.platform.ucenter.speedyLogin',
                        deviceId: deviceId,
                        activateTokenId: Util.getActivateInfo().activateTokenId || '',
                        sessionId: Util.getUserData().sessionId
                    }).then(function (result) {
                        console.info(result);
                        if (result.status == '0') { //失败
                            deferred.reject(result);
                        } else {
                            //成功
                            var userData = {
                                userId: result.data.userId,
                                userPlatformId: '0001',
                                userName: result.data.userName,
                                password: '',
                                palmId: result.data.palmId,
                                nickName: result.data.nickName,
                                loginType: result.data.loginType,
                                bindPhone: result.data.phone,
                                bindEmail: result.data.email,
                                bindTokenId: result.data.bindPhone.bindTokenId,
                                needBindPhone: result.data.bindPhone.isNeed,
                                isLimit: result.data.limit.isLimit,
                                limitDesc: result.data.limit.limitDesc,
                                deviceId: deviceId,
                                loginTime: new Date()
                            };

                            window.pageBridge.invokeSdkLoginSuccess(userData);
                            $rootScope.fastLoginData = userData; //快登成功 记录快登用户信息

                            deferred.resolve(userData);
                        }
                    })
                });

                return deferred.promise;
            }

            /**
             * 使用正式账号登录
             * @param username 登录用户名，该字段可以传用户名，手机号或者邮箱，需要服务器端判断
             * @param password 密码
             * @param activateTokenId 激活的tokenId
             * @returns {Promise}
             */
            function normalUserLogin(username, password) {
                var data = {
                    service: 'palm.platform.ucenter.login',
                    sessionId: Util.getUserData().sessionId,
                    loginName: username,
                    userPwd: password,
                    activateTokenId: Util.getActivateInfo().activateTokenId || '' //可以为空	激活的tokenId
                };

                var deferred = $q.defer();
                sendRequest2UCenter(entry_url, data).then(function (result) {
                    console.info(['normalUserLogin', result]);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    } else {
                        //成功
                        var userData = {
                            userId: result.data.userId,
                            userPlatformId: result.data.userPlatformId,
                            userName: result.data.userName,
                            password: password,
                            palmId: result.data.palmId,
                            nickName: result.data.nickName,
                            loginType: result.data.loginType,
                            bindPhone: result.data.phone ? result.data.phone : '',
                            bindEmail: result.data.email ? result.data.email : '',
                            bindTokenId: result.data.bindPhone.bindTokenId,
                            needBindPhone: result.data.bindPhone.isNeed,
                            isLimit: result.data.limit.isLimit,
                            limitDesc: result.data.limit.limitDesc,
                            deviceId: $rootScope.fastLoginData ? $rootScope.fastLoginData.deviceId : '', //从快登信息中获取deviceId
                            loginTime: new Date()
                        };
                        //window.pageBridge.invokeSdkLoginSuccess(userData);
                        $rootScope.normalLoginData = userData; //正式登录成功 记录正式的登录用户信息
                        deferred.resolve(userData);
                    }
                });

                return deferred.promise;
            }

            function normalUserLoginBySDK(userId) {
                var deferred = $q.defer();
                window.pageBridge.invokeSdkUserLogin({
                    userId: userId
                }, function (response) {
                    var result = angular.fromJson(response);
                    if (result.status == '0') {
                        result = angular.fromJson(result.data);
                        if (result.status == '1') {
                            //成功
                            var userData = {
                                userId: result.data.userId,
                                userPlatformId: result.data.userPlatformId,
                                userName: result.data.userName,
                                palmId: result.data.palmId,
                                nickName: result.data.nickName,
                                loginType: result.data.loginType,
                                bindPhone: result.data.phone ? result.data.phone : '',
                                bindEmail: result.data.email ? result.data.email : '',
                                bindTokenId: result.data.bindPhone.bindTokenId,
                                needBindPhone: result.data.bindPhone.isNeed,
                                isLimit: result.data.limit.isLimit,
                                limitDesc: result.data.limit.limitDesc,
                                deviceId: $rootScope.fastLoginData ? $rootScope.fastLoginData.deviceId : '', //从快登信息中获取deviceId
                                loginTime: new Date()
                            };
                            $rootScope.normalLoginData = userData; //正式登录成功 记录正式的登录用户信息
                            deferred.resolve(userData);
                        } else {
                            deferred.reject(result);
                        }
                    } else {
                        deferred.reject({errorDesc: '网络不可达', errorCode: '0'});
                    }
                });
                return deferred.promise;
            }

            /**
             * 将快登用户 升级为 正式用户
             */
            function upgrade2NormalUser(username, password) {
                var data = {
                    service: 'palm.platform.ucenter.bindUser',
                    sessionId: Util.getUserData().sessionId,
                    newUserName: username,
                    newUserPwd: password
                };

                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    } else {
                        //成功
                        var resultData = {
                            isNeedBindPhone: result.data.isNeedBindPhone == '1' ? true : false,
                            bindTokenId: result.data.bindPhone.bindTokenId
                        };

                        //升级完成后要清除数据
                        $rootScope.fastLoginData = null;

                        //升级成功后，调用用户中心的普通用户登录接口进行一次登录，然后登录成功调用SDK的invokeSdkLoginSuccess接口进行同步SDK登录成功信息
                        normalUserLogin(username, password).then(function () {
                            deferred.resolve(resultData);
                        }, function (result) {
                            deferred.reject(result);
                        });
                    }
                });

                return deferred.promise;
            }

            /**
             * 发送验证码接口
             * @param phone 手机号
             * @param orderService 订购的服务
             */
            function sendPhoneCaptcha(phone, orderService) {
                var data = {
                    service: 'palm.platform.ucenter.sendCommonPhoneVerifyCode',
                    sessionId: Util.getUserData().sessionId,
                    phone: phone,
                    orderService: orderService
                    //palm.platform.ucenter.unbindPhone.unbind 解绑手机 发送验证码
                    //'palm.platform.ucenter.bindPhone.bind' //绑定手机服务  必填	订购服务，该参数意义为：传入订购该接口的服务
                    //'palm.platform.ucenter.forgetPwd.validatePhoneVerifyCode' //找回密码 发送验证码服务
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        alert([result.errorDesc, '(', result.errorCode, ')'].join(''));
                        deferred.reject(result);
                    }
                    deferred.resolve();
                });
                return deferred.promise;
            }

            /**
             * 用户未绑定手机时 需要发送验证码 来绑定手机
             */
            function sendBindPhoneCaptcha(phone) {
                return sendPhoneCaptcha(phone, 'palm.platform.ucenter.bindPhone.bind');
            }

            /**
             * 用户绑定手机时 需要发送验证码 来解绑手机
             */
            function sendUnbindPhoneCaptcha(phone) {
                return sendPhoneCaptcha(phone, 'palm.platform.ucenter.unbindPhone.unbind');
            }

            /**
             * 绑定手机
             */
            function bindPhone(captcha, tokenId) {
                tokenId = tokenId || ($rootScope.normalLoginData ? $rootScope.normalLoginData.bindTokenId : ($rootScope.registerData ? $rootScope.registerData.bindTokenId : ''));
                var data = {
                    service: 'palm.platform.ucenter.bindPhone.bind',
                    sessionId: Util.getUserData().sessionId,
                    phoneVerifyCode: captcha,
                    tokenId: tokenId //必填手机令牌ID
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }
                    deferred.resolve();
                });
                return deferred.promise;
            }

            /**
             * 获取用户信息
             * 用途：找回密码第一步时，需要通过用户名或者手机号查看用户是否存在，是否绑定了手机号
             * @param account 用户名 或者 手机号
             */
            function getUserInfo(account) {
                var data = {
                    service: 'palm.platform.ucenter.forgetPwd.getUserInfo',
                    sessionId: Util.getUserData().sessionId,
                    userName: account
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }
                    var userInfo = {
                        userName: result.data.userName,
                        phone: result.data.phone
                    };
                    deferred.resolve(userInfo);
                });
                return deferred.promise;
            }

            /**
             * 找回密码发送 验证码
             */
            function sendFindPasswordCaptcha(phone) {
                return sendPhoneCaptcha(phone, 'palm.platform.ucenter.forgetPwd.validatePhoneVerifyCode');
            }

            /**
             * 校验找回密码的 验证码 是否正确
             * @param captcha 用户输入的验证码 6位
             */
            function validateFindPasswordCaptcha(captcha) {
                var data = {
                    service: 'palm.platform.ucenter.forgetPwd.validatePhoneVerifyCode',
                    sessionId: Util.getUserData().sessionId,
                    phoneVerifyCode: captcha
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }

                    var tokenId = result.data.tokenId; //忘记密码中的令牌
                    deferred.resolve(tokenId);
                });
                return deferred.promise;
            }

            /**
             * 找回密码 -- 重置密码
             * @param newPassword 重置新密码
             * @param tokenId 令牌 见 validateFindPasswordCaptcha
             */
            function findPassword(newPassword, tokenId) {
                var data = {
                    service: 'palm.platform.ucenter.forgetPwd.resetPwd',
                    sessionId: Util.getUserData().sessionId,
                    tokenId: tokenId,
                    newPwd: newPassword
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }
                    deferred.resolve();
                });
                return deferred.promise;
            }

            /**
             * 找回密码 -- 重置密码
             * @param newPassword 重置新密码
             * @param tokenId 令牌 见 validateFindPasswordCaptcha
             */
            function findPasswordAndAutoLogin(account, newPassword, tokenId) {
                var data = {
                    service: 'palm.platform.ucenter.forgetPwd.resetPwd',
                    sessionId: Util.getUserData().sessionId,
                    tokenId: tokenId,
                    newPwd: newPassword
                };
                var deferred = $q.defer();
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }

                    //密码重置成功后，调用用户中心的普通用户登录接口进行一次登录，然后登录成功调用SDK的invokeSdkLoginSuccess接口进行同步SDK登录成功信息
                    normalUserLogin(account, newPassword).then(function (userData) {
                        deferred.resolve(userData);
                    });
                });
                return deferred.promise;
            }

            /**
             * 注册新用户
             */
            function registerUser(username, password) {
                var data = {
                    service: 'palm.platform.ucenter.userNameRegister',
                    sessionId: Util.getUserData().sessionId,
                    userName: username,
                    userPwd: password,
                    activateTokenId: Util.getActivateInfo().activateTokenId || '' //可以为空	激活的tokenId
                };
                var deferred = $q.defer();
                sendRequest2UCenter(entry_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }

                    var userData = {
                        userId: result.data.userId,
                        userPlatformId: result.data.userPlatformId,
                        userName: result.data.userName,
                        password: password,
                        palmId: result.data.palmId,
                        nickName: result.data.nickName,
                        loginType: result.data.loginType,
                        bindPhone: result.data.phone ? result.data.phone : '',
                        bindEmail: result.data.email ? result.data.email : '',
                        bindTokenId: result.data.bindPhone.bindTokenId,
                        needBindPhone: result.data.bindPhone.isNeed,
                        isLimit: result.data.limit.isLimit,
                        limitDesc: result.data.limit.limitDesc,
                        deviceId: $rootScope.fastLoginData ? $rootScope.fastLoginData.deviceId : '', //从快登信息中获取deviceId
                        loginTime: new Date()
                    };

                    $rootScope.registerData = userData; //注册成功,记录注册成功的数据
                    deferred.resolve(userData);
                });
                return deferred.promise;
            }

            /**
             * 获取本地记录的登录过的用户信息列表
             */
            function getLoginedUsers() {
                var deferred = $q.defer();
                window.pageBridge.applyCall(function () {
                    window.pageBridge.invokeSdkGetLoginedUsers(function (users) {
                        var userData = angular.fromJson(users);
                        deferred.resolve(userData);
                    });
                });
                return deferred.promise;
            }

            /**
             * 删除SDK中记录的用户信息
             */
            function deleteUserRecord(userId) {
                var deferred = $q.defer();
                window.pageBridge.invokeSdkDelUser({'userId': userId}, function (result) {
                    var deleted = angular.fromJson(result);
                    if (deleted) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
                return deferred.promise;
            }

            /**
             * 解绑手机号
             */
            function unBindPhone(captcha, password) {
                var deferred = $q.defer();
                //解绑第一步 验证密码
                validatePassword(password, 'palm.platform.ucenter.unbindPhone.unbind').then(function (tokenId) {
                    //解绑第二步 验证验证码
                    var data = {
                        service: 'palm.platform.ucenter.unbindPhone.unbind',
                        sessionId: Util.getUserData().sessionId,
                        phoneVerifyCode: captcha,
                        tokenId: tokenId
                    };
                    sendRequest2UCenter(core_url, data).then(function (result) {
                        if (result.status == '0') { //失败
                            deferred.reject(result);
                        } else {
                            window.pageBridge.invokeSdkUserUnBindNotify({
                                userId: $rootScope.UCenterBase_$$_CurrentLoginUser.userId,
                                unBindType: 'phone'
                            }, function () {
                                deferred.resolve();
                            });
                        }
                    });
                }, function (result) {
                    deferred.reject(result);//失败
                });
                return deferred.promise;
            }

            /**
             * 重新绑定手机号 | 更换绑定手机号
             */
            function rebindPhone(captcha, password) {
                var deferred = $q.defer();
                //重绑手机 第一步 验证密码
                validatePassword(password, 'palm.platform.ucenter.bindPhone.bind').then(function (tokenId) {
                    //重绑手机 第二步 验证验证码
                    var data = {
                        service: 'palm.platform.ucenter.bindPhone.bind',
                        sessionId: Util.getUserData().sessionId,
                        phoneVerifyCode: captcha,
                        tokenId: tokenId
                    };
                    sendRequest2UCenter(core_url, data).then(function (result) {
                        console.info(['重新绑定手机号成功', result]);
                        if (result.status == '0') { //失败
                            deferred.reject(result);
                        } else {
                            deferred.resolve();
                        }
                    });
                }, function (result) {
                    deferred.reject(result);//失败
                });
                return deferred.promise;
            }

            /**
             * 设置目的更新版本不再进行提示
             */
            function setNoUpdatePrompt(version) {
                var data = {
                    version: version,
                    prompt: 'false'
                };
                window.pageBridge.invokeSdkSetUpdatePrompt(data);
            }

            /**
             * 更新下载接口
             */
            function upgradeGamePkg(url, fileSize) {
                var deferred = $q.defer();
                var data = {
                    url: url,
                    fileSize: fileSize
                };
                window.pageBridge.invokeSdkDownloadGame(data, function (result) {
                    result = angular.fromJson(result);
                    if (result) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
                return deferred.promise;
            }

            /**
             * 激活用户
             */
            function activateUser(cdkey) {
                var deferred = $q.defer();
                var data = {
                    service: 'palm.platform.ucenter.activateUser',
                    sessionId: Util.getUserData().sessionId,
                    activateCode: cdkey,
                    gameVersion: Util.getGameInfo().version
                };
                sendRequest2UCenter(entry_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    } else {
                        var data = {
                            activateCode: cdkey,
                            activateTokenId: result.data.activateTokenId
                        };
                        window.pageBridge.invokeSdkActivateNotify(data);
                        deferred.resolve(data);
                    }
                });
                return deferred.promise;
            }

            function getPromptNotice() {
                var deferred = $q.defer();
                var data = {
                    service: 'palm.platform.ucenter.getNoticeContent',
                    sessionId: Util.getUserData().sessionId,
                    gameVersion: Util.getGameInfo().version
                };
                sendRequest2UCenter(entry_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }
                    deferred.resolve(result.data.noticeContent);
                });
                return deferred.promise;
            }

            /**
             * 验证密码
             * @param pwd 待验证的密码
             * @param orderService 需要订购的服务
             */
            function validatePassword(pwd, orderService) {
                var deferred = $q.defer();
                var data = {
                    service: 'palm.platform.ucenter.validatePwd',
                    sessionId: Util.getUserData().sessionId,
                    pwd: pwd,
                    orderService: orderService
                };
                sendRequest2UCenter(core_url, data).then(function (result) {
                    console.info(result);
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    }
                    deferred.resolve(result.data.tokenId);
                });
                return deferred.promise;
            }

            function validatePassword4BindPhone(pwd) {
                return validatePassword(pwd, 'palm.platform.ucenter.bindPhone.bind');
            }

            function thirdPartyLogin(type) {
                var logurl = 'http://authdev.gamebean.net/ucenter2.0/ucenter_entry3.0/customization/grantLogin.do?type=' + type + '&sessionId=' + Util.getUserData().sessionId;
                var tempUrl = $location.absUrl();
                logurl += '&callback=' + (tempUrl.substr(0, tempUrl.indexOf("#")) + encodeURIComponent(encodeURIComponent('#')) + "/login/thirdParty");
                console.log(logurl);
                // window.pageBridge.invokeSdkGetPromptInfo(function (data) {
                //     console.log(data);
                // });
                window.location.href = logurl;
            }

            function finishedThirdPartyLogin(data){
                var deferred = $q.defer();
                 if(data.status=='0'){
                      deferred.reject();
                 }else{
                     getDeviceId().then(function (deviceId) {
                         var userData = {
                             userId: result.data.userId,
                             userPlatformId: '0001',
                             userName: result.data.userName,
                             password: '',
                             palmId: result.data.palmId,
                             nickName: result.data.nickName,
                             loginType: result.data.loginType,
                             bindPhone: result.data.phone,
                             bindEmail: result.data.email,
                             bindTokenId: result.data.bindPhone.bindTokenId,
                             needBindPhone: result.data.bindPhone.isNeed,
                             isLimit: result.data.limit.isLimit,
                             limitDesc: result.data.limit.limitDesc,
                             deviceId: deviceId,
                             loginTime: new Date()
                         };
                         window.pageBridge.invokeSdkLoginFinished(userData);
                         deferred.resolve();
                     });
                    
                     
                 }
                return deferred.promise;
            }

            return {
                sendRequest2UCenter: sendRequest2UCenter,
                fastLogin: fastUserLogin, //快登
                normalUserLogin: normalUserLogin, //正式用户登录
                upgrade2NormalUser: upgrade2NormalUser, //升级快登账号为正式账号
                sendBindPhoneCaptcha: sendBindPhoneCaptcha, //绑定手机发送验证码
                bindPhone: bindPhone, //绑定手机
                getUserInfo: getUserInfo, // 根据用户名或者手机号获取用户信息
                sendFindPasswordCaptcha: sendFindPasswordCaptcha,
                validateFindPasswordCaptcha: validateFindPasswordCaptcha,
                findPasswordAndAutoLogin: findPasswordAndAutoLogin,
                registerUser: registerUser,
                getLoginedUsers: getLoginedUsers,
                deleteUserRecord: deleteUserRecord,
                findPassword: findPassword,
                sendUnbindPhoneCaptcha: sendUnbindPhoneCaptcha,
                unBindPhone: unBindPhone,
                rebindPhone: rebindPhone,
                setNoUpdatePrompt: setNoUpdatePrompt,
                upgradeGamePkg: upgradeGamePkg,
                activateUser: activateUser,
                getPromptNotice: getPromptNotice,
                validatePassword4BindPhone: validatePassword4BindPhone, //绑定手机第一步验证密码
                normalUserLoginBySDK: normalUserLoginBySDK,
                thirdPartyLogin: thirdPartyLogin,
                finishedThirdPartyLogin:finishedThirdPartyLogin
            }
        }])
})(window, angular);