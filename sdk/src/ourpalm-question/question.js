define(['angular-translate', 'angular-translate-loader-static-files', 'common/Util', 'question/services/QuestionServices'], function () {

    return angular.module('question', ['ngRoute', 'pascalprecht.translate', 'HttpModule', 'question.service', 'util'])

        // .config(['$routeProvider', '$translateProvider', '$httpProvider', function ($routeProvider, $translateProvider) {
        //     /* 通过 angular-translate-loader-static-files 加载 */
        //     $translateProvider.useStaticFilesLoader({
        //         files: [{
        //             prefix: 'i18n/locale-question-',
        //             suffix: '.json'
        //         }]
        //     });
        //     /* 设置首选语言 */
        //     $translateProvider.preferredLanguage('zh_CN');
        //     /* 设置安全策略 */
        //     $translateProvider.useSanitizeValueStrategy('escaped');
        // }])

        /**
         * 这里是初始化页面的参数,进入页面时调用一次
         */
        .run(function ($rootScope) {

        });

});