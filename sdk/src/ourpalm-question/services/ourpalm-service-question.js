(function (angular) {

    angular.module('ourpalm-service-question', ['ourpalm-util', 'ourpalm-util-http'])

        .config(['$httpProvider', function ($httpProvider) {
            //配置$http
            $httpProvider.interceptors.push('ajaxLoadingInterceptor');
            $httpProvider.interceptors.push('httpErrorInterceptor');
        }])

        .service('QuestionService', ['$http', '$q', 'Util', function ($http, $q, Util) {

            var baseUrl = 'http://test.platform.gamebean.net/customerservice/';
            var statusUrl = baseUrl + 'js/001019.htm';
            var questionTypeListUrl = baseUrl + 'js/001013.htm';
            var questionTypeDetailListUrl = baseUrl + 'js/001023.htm';
            var myQuestionListUrl = baseUrl + 'js/001020.htm';
            var questionTypeUrl = baseUrl + 'js/001022.htm';
            var uploadImgUrl = baseUrl + 'sdk/001025.htm';
            var evaluationUrl = baseUrl + 'js/001016.htm';
            var askQuestionUrl = baseUrl + 'js/001014.htm';
            var questionReplyUrl = baseUrl + 'js/001018.htm';
            var appendQuestionUrl = baseUrl + 'js/001015.htm';

            /**
             * 获取我的问题的 当前状态
             */
            function getQuestionStatus() {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        userId: Util.getUserData().userId,
                        pCode: Util.getPcodeInfo().pcode41
                    })
                };
                Util.jsonp(statusUrl, data).success(function (result) {
                    console.info(result);
                    if (result.status == '0' && result.myStatus == '0') {
                        deferred.resolve();
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 常见问题 列表
             */
            function getQuestionTypeList() {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41
                    })
                };
                Util.jsonp(questionTypeListUrl, data, {cache: true}).success(function (result) {
                    console.info(result);
                    if (result.list) {
                        deferred.resolve(result.list);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 常见问题 --> 某一个常见问题 --> 问题列表
             */
            function getQuestionTypeDetailList(categoryId, catetoryRelation) {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41,
                        type: categoryId,
                        catetoryRelation: catetoryRelation
                    })
                };
                Util.jsonp(questionTypeDetailListUrl, data, {cache: true}).success(function (result) {
                    console.info(result);
                    if (result.list) {
                        deferred.resolve(result.list);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 我的问题列表
             */
            function getMyQuestionList() {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41,
                        userId: Util.getUserData().userId,
                        date: new Date().getTime()
                    })
                };
                Util.jsonp(myQuestionListUrl, data).success(function (result) {
                    console.info(['myQuestionListUrl', result]);
                    if (result.list && result.list.length != 0) {
                        deferred.resolve(result.list);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 获取所有的问题类型
             */
            function getQuestionType() {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41
                    })
                };
                Util.jsonp(questionTypeUrl, data, {cache: true}).success(function (result) {
                    console.info(result);
                    if (result.typeList) {
                        deferred.resolve(result.typeList);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * SDK选择图片上传
             */
            function chooseImage() {
                var deferred = $q.defer();
                var data = {
                    uploadurl: uploadImgUrl,
                    filesize: '2048'
                };
                window.pageBridge.invokeSdkUploadImg(data, function (result) {
                    result = angular.fromJson(result);
                    switch (result.status) {
                        case '0':
                            return deferred.resolve(result);
                        case '1':
                            alert('用户取消上传图片');
                            return deferred.reject(result);
                        case '2':
                            alert('网络异常');
                            return deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 客服评价 五颗星
             */
            function questionEvaluation(questionId, stars) {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41,
                        qId: questionId,
                        valuateStars: stars
                    })
                };
                Util.jsonp(evaluationUrl, data).success(function (result) {
                    console.info(result);
                    if (result.status == 0) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 我要提问
             */
            function askQuestion(categoryId, detail, phone, imgPath1, imgPath2) {
                var deferred = $q.defer();
                var pNum = (imgPath1 && imgPath2 && 2) || ((imgPath1 || imgPath2) && 1) || 0;
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41,
                        oserver: Util.getGameInfo().serverId,
                        gameServerId: Util.getGameInfo().serverId,
                        orole: Util.getGameInfo().roleId,
                        categoryId: categoryId,
                        detail: detail,
                        mobile: phone,
                        email: '',
                        roleName: Util.getGameInfo().roleName,
                        roleId: Util.getGameInfo().roleId,
                        serverCode: Util.getGameInfo().serverId,
                        userId: Util.getUserData().userId,
                        from: '1',
                        pNum: pNum,
                        imgPath1: imgPath1 || '',
                        imgPath2: imgPath2 || ''
                    })
                };
                Util.jsonp(askQuestionUrl, data).success(function (result) {
                    console.info(result);
                    if (result.status == 0) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 问题回复
             */
            function questionReply(questionId) {
                var deferred = $q.defer();
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41,
                        ouser: Util.getUserData().userId,
                        qId: questionId
                    })
                };
                Util.jsonp(questionReplyUrl, data).success(function (result) {
                    console.info(result);
                    if (!!result.repalyList) {
                        deferred.resolve(result.repalyList);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            /**
             * 追加问题
             */
            function appendQuestion(questionId, detail, imgPath1, imgPath2) {
                var deferred = $q.defer();
                var pNum = (imgPath1 && imgPath2 && 2) || ((imgPath1 || imgPath2) && 1) || 0;
                var data = {
                    jsonStr: JSON.stringify({
                        pCode: Util.getPcodeInfo().pcode41,
                        qId: questionId,
                        detail: detail,
                        userId: Util.getUserData().userId,
                        pNum: pNum,
                        replayType: '1',
                        imgPath1: imgPath1,
                        imgPath2: imgPath2
                    })
                };
                Util.jsonp(appendQuestionUrl, data).success(function (result) {
                    console.info(result);
                    if (result.status == 0) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(result);
                    }
                });
                return deferred.promise;
            }

            return {
                getQuestionStatus: getQuestionStatus,
                getQuestionTypeList: getQuestionTypeList,
                getQuestionTypeDetailList: getQuestionTypeDetailList,
                getMyQuestionList: getMyQuestionList,
                getQuestionType: getQuestionType,
                chooseImage: chooseImage,
                questionEvaluation: questionEvaluation,
                askQuestion: askQuestion,
                questionReply: questionReply,
                appendQuestion: appendQuestion
            }
        }]);

})(angular);