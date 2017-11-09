(function (window, angular) {
    /**
     * 登录模块 所有service
     */
    angular.module('ourpalm-service-ucenter', ['ourpalm-util', 'ourpalm-util-http'])

        .config(['$httpProvider', function ($httpProvider) {
            //配置$http
            $httpProvider.interceptors.push('ajaxLoadingInterceptor');
            $httpProvider.interceptors.push('httpErrorInterceptor');
        }])

        .service('UCenterService', ['$http', '$q', '$rootScope', '$timeout', 'Util', function ($http, $q, $rootScope, $timeout, Util) {

            /**
             * 获取当前登录的用户信息
             */
            function getCurrentLoginUser() {
                var deferred = $q.defer();
                if (!!$rootScope.UCenterBase_$$_CurrentLoginUser) {
                    $timeout(function () {
                        deferred.resolve($rootScope.UCenterBase_$$_CurrentLoginUser);
                    });
                } else {
                    window.pageBridge.applyCall(function () {
                        window.pageBridge.invokeSdkGetCurrentUser(function (result) {
                            var user = angular.fromJson(result);
                            $rootScope.UCenterBase_$$_CurrentLoginUser = user;
                            deferred.resolve(user);
                        });
                    });
                }
                return deferred.promise;
            }

            /**
             * 修改昵称
             */
            function changeNickname(nickname) {
                var deferred = $q.defer();
                var data = {
                    service: 'palm.platform.ucenter.updateNickName',
                    sessionId: Util.getUserData().sessionId,
                    newNickName: nickname
                };

                Util.sendRequest2UCenter(Util.core_url, data).then(function (result) {
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    } else {
                        getCurrentLoginUser().then(function (user) {
                            var data = {
                                userId: user.userId,
                                nickName: nickname
                            };
                            window.pageBridge.invokeSdkUserModifyNickNameNotify(data, function (result) {
                                result = angular.fromJson(result);
                                if (result) {
                                    $rootScope.UCenterBase_$$_CurrentLoginUser = null; //置空
                                    deferred.resolve();
                                } else {
                                    deferred.reject({errorCode: 9999, errorDesc: '通知更新到SDK失败'});
                                }

                            });
                        });
                    }
                });
                return deferred.promise;
            }

            /**
             * 修改密码
             */
            function changePassword(oldPassword, newPassword) {
                var deferred = $q.defer();
                var data = {
                    service: 'palm.platform.ucenter.updateUserPwd',
                    sessionId: Util.getUserData().sessionId,
                    originalPwd: oldPassword,
                    newPwd: newPassword
                };

                Util.sendRequest2UCenter(Util.core_url, data).then(function (result) {
                    if (result.status == '0') { //失败
                        deferred.reject(result);
                    } else {
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            }

            function upgrade2NormalUser(username, password) {
                var deferred = $q.defer();
                Util.upgrade2NormalUser(username, password, Util.getUserData().sessionId).then(function () {
                    var data = {
                        userId: $rootScope.UCenterBase_$$_CurrentLoginUser.userId,
                        userName: username,
                        password: password,
                        loginType: 'commonLogin'
                    };
                    window.pageBridge.invokeSdkUserUpgradeNotify(data, function (result) {
                        var notifySuccess = angular.fromJson(result);
                        if (notifySuccess) {
                            $rootScope.UCenterBase_$$_CurrentLoginUser = null; //置空
                            deferred.resolve();
                        } else {
                            deferred.reject({errorCode: 9999, errorDesc: '通知更新到SDK失败'});
                        }
                    })
                }, function (result) {
                    deferred.reject(result);
                });
                return deferred.promise;
            }

            /**
             * 用户中心绑定手机或者邮箱成功时通知 SDK
             * @param phone
             * @param email
             */
            function notifySDKBindPhoneOrMailSuccess(phone, email) {
                var deferred = $q.defer();
                var data = {
                    userId: $rootScope.UCenterBase_$$_CurrentLoginUser.userId,
                    bindPhone: phone || '',
                    bindEmail: email || ''
                };
                window.pageBridge.invokeSdkUserBindNotify(data, function (result) {
                    result = angular.fromJson(result);
                    if (result) {
                        $rootScope.UCenterBase_$$_CurrentLoginUser = null; //置空
                        deferred.resolve();
                    } else {
                        deferred.reject({errorCode: 9999, errorDesc: '通知更新到SDK失败'});
                    }
                });
                return deferred.promise;
            }

            function notifySDKModifyPasswordSuccess(password) {
                var deferred = $q.defer();
                var data = {
                    userId: $rootScope.UCenterBase_$$_CurrentLoginUser.userId,
                    password: password
                };
                window.pageBridge.invokeSdkUserModifyPasswordNotify(data, function (result) {
                    result = angular.fromJson(result);
                    if (result) {
                        $rootScope.UCenterBase_$$_CurrentLoginUser = null; //置空
                        deferred.resolve();
                    } else {
                        deferred.reject({errorCode: 9999, errorDesc: '通知更新到SDK失败'});
                    }
                });
                return deferred.promise;
            }


            return {
                getCurrentLoginUser: getCurrentLoginUser,
                changeNickname: changeNickname,
                changePassword: changePassword,
                upgrade2NormalUser: upgrade2NormalUser,
                notifySDKBindPhoneOrMailSuccess: notifySDKBindPhoneOrMailSuccess,
                notifySDKModifyPasswordSuccess: notifySDKModifyPasswordSuccess
            }
        }])

})(window, angular);