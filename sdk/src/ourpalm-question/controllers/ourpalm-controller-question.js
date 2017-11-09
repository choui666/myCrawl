(function (angular) {

    angular.module('ourpalm-app')

    /**
     * 客服中心 首页
     */
        .controller('Question__IndexController', ['$rootScope', 'QuestionService', function ($rootScope, QuestionService) {
            var vm = this;

            vm.status = false;

            QuestionService.getQuestionStatus().then(function () {
                vm.status = true;
            });

            QuestionService.getQuestionTypeList().then(function (data) {
                vm.questions = data;
            });
        }])


        /**
         * 常见问题 单个常见问题列表页
         */
        .controller('Question__QuestionTypeController', ['$rootScope', '$routeParams', 'QuestionService', function ($rootScope, $routeParams, QuestionService) {
            var vm = this;

            QuestionService.getQuestionTypeDetailList($routeParams.categoryId, $routeParams.catetoryRelation).then(function (data) {
                vm.questions = data;
            });

            vm.gotoQuestionTypeDetail = function (index) {
                $rootScope.Question_QuestionTypeDetailCtl_$$_Question = vm.questions[index];
                $rootScope.goto('question/question_type_detail');
            }

        }])


        /**
         * 常见问题 单个常见问题列表页
         */
        .controller('Question__QuestionTypeDetailController', ['$rootScope', function ($rootScope) {
            var vm = this;
            vm.question = $rootScope.Question_QuestionTypeDetailCtl_$$_Question;
            vm.title = vm.question.questionTitle;
            vm.content = vm.question.questionContent;
        }])


        /**
         * 我的问题 列表页面
         */
        .controller('Question__MyQuestionController', ['$rootScope', '$routeParams', 'QuestionService', function ($rootScope, $routeParams, QuestionService) {
            var vm = this;
            vm.questions = [];

            QuestionService.getMyQuestionList().then(function (data) {
                vm.questions = data;
            }, function (result) {
                //亲，您还没有提过任何的问题哦
            });

            vm.gotoQuestionReply = function (index) {
                var question = vm.questions[index];
                $rootScope.Question_QuestionReplyCtl_$$_QuestionId = question.qId;
                $rootScope.Question_QuestionReplyCtl_$$_QuestionStatus = question.qStatus;
                $rootScope.goto('question/question_detail');
            };
        }])


        /**
         * 我的问题 列表详情页面
         */
        .controller('Question__QuestionReplyController', ['$rootScope', '$routeParams', 'QuestionService', 'picbox', function ($rootScope, $routeParams, QuestionService, picbox) {
            var vm = this;

            vm.questionId = $rootScope.Question_QuestionReplyCtl_$$_QuestionId;
            vm.qStatus = $rootScope.Question_QuestionReplyCtl_$$_QuestionStatus;
            // var qType = T.getParameter('qType');
            // var questionId = T.getParameter('questionId');
            // var qStatus = T.getParameter('qStatus');

            QuestionService.questionReply(vm.questionId).then(function (data) {
                vm.replys = data;
            }, function (result) {
                //亲，您还没有提过任何的问题哦
            });
        }])


        /**
         * 追加问题
         */
        .controller('Question__QuestionAppendController', ['$rootScope', '$routeParams', 'QuestionService', 'Util', 'toast', 'picbox', function ($rootScope, $routeParams, QuestionService, Util, toast, picbox) {
            var vm = this;
            vm.images = [];

            vm.choosePicture = function () {
                if (vm.images.length > 2) {
                    return toast.translate('login_t18_key1'); //图片最多上传两张喔!
                }
                QuestionService.chooseImage().then(function (result) {
                    if (result.data.status != 0) {
                        return toast(result.data.desc);
                    }
                    vm.images.push({
                        localUrl: result.localurl,
                        remoteUrl: result.data.imgUrl,
                        imgPath: result.data.imgPath
                    })
                });
            };

            vm.removeImage = function (index) {
                vm.images.removeAt(index);
            };

            vm.appendQuestion = function () {
                if (Util.isEmpty(vm.desc)) {
                    return toast.translate('login_t18_key2'); //问题描述不能为空
                }
                if (vm.desc.length <= 10) {
                    return toast.translate('login_t18_key3'); //问题描述应大于10个字符
                }
                if (vm.desc.length > 200) {
                    return toast.translate('login_t18_key4'); //问题描述不得超过200字
                }

                var imgPath1 = vm.images[0] && vm.images[0].imgPath;
                var imgPath2 = vm.images[1] && vm.images[1].imgPath;
                QuestionService.appendQuestion($routeParams.questionId, vm.desc, imgPath1, imgPath2).then(function () {
                    toast.translate('login_t18_key5'); //问题提交成功
                    $rootScope.back();
                });
            };
        }])


        /**
         * 我要提问
         */
        .controller('Question__AskQuestionController', ['$rootScope', 'QuestionService', 'toast', 'Util', 'picbox', function ($rootScope, QuestionService, toast, Util, picbox) {
            var vm = this;
            vm.types = [];
            vm.images = [];

            QuestionService.getQuestionType().then(function (data) {
                vm.types = data;
            });

            vm.choosePicture = function () {
                if (vm.images.length >= 2) {
                    return toast.translate('login_t19_key1'); //图片最多上传两张喔!
                }

                QuestionService.chooseImage().then(function (result) {
                    if (result.data.status != 0) {
                        return alert(result.data.desc);
                    }

                    vm.images.push({
                        localUrl: result.localurl,
                        remoteUrl: result.data.imgUrl,
                        imgPath: result.data.imgPath
                    })
                });
            };

            vm.removeImage = function (index) {
                vm.images.removeAt(index);
            };

            vm.askQuestion = function () {
                if (Util.isEmpty(vm.type)) {
                    return toast.translate('login_t19_key2'); //请选择问题类别
                }
                if (Util.isEmpty(vm.desc)) {
                    return toast.translate('login_t19_key3'); //问题描述不能为空
                }
                if (vm.desc.length <= 10) {
                    return toast.translate('login_t19_key4'); //问题描述应大于10个字符
                }
                if (vm.desc.length > 200) {
                    return toast.translate('login_t19_key5'); //问题描述不得超过200字
                }
                if (Util.isEmpty(vm.phone)) {
                    return toast.translate('login_t19_key6'); //手机号不能为空
                }
                if (!Util.checkPhone(vm.phone)) {
                    return toast.translate('login_t19_key7'); //手机号不合法
                }

                var imgPath1 = vm.images[0] && vm.images[0].imgPath;
                var imgPath2 = vm.images[1] && vm.images[1].imgPath;
                QuestionService.askQuestion(vm.types[vm.type].categoryId, vm.desc, vm.phone, imgPath1, imgPath2).then(function () {
                    toast.translate('login_t19_key8'); //问题提交成功
                    $rootScope.back();
                });
            };
        }])


        /**
         * 客服评价
         */
        .controller('Question__EvaluationController', ['$rootScope', '$routeParams', 'QuestionService', 'toast', function ($rootScope, $routeParams, QuestionService, toast) {
            var vm = this;
            vm.stars = 5;

            vm.changeStar = function (count) {
                vm.stars = count;
            };

            vm.evaluate = function () {
                QuestionService.questionEvaluation($routeParams.questionId, vm.stars).then(function () {
                    toast.translate('login_t21_key1'); //感谢您的评价！
                    $rootScope.goto('question/question_mine');
                }, function (result) {
                    alert(result.desc);
                });
            };
        }])

})(angular);