//加载css
require('./common/directive.css');
require('./common/layout.css');

//加载lib库
var angular = require('angular');
require('angular-route');
require('angular-animate');
require('angular-base64');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-cookies');
require('angular-translate-storage-cookie');
require('angular-translate-storage-local');

//加载util
require('./ourpalm-util/ourpalm-util');
require('./ourpalm-util-http/ourpalm-util-http');

//加载service
require('./ourpalm-login/services/ourpalm-service-login');
require('./ourpalm-question/services/ourpalm-service-question');
require('./ourpalm-ucenter/services/ourpalm-service-ucenter');
require('./ourpalm-pcenter/services/ourpalm-service-pcenter');

//加载app
require('./ourpalm-app/ourpalm-app');

//加载controller
require('./ourpalm-login/controllers/ourpalm-controller-login');
require('./ourpalm-question/controllers/ourpalm-controller-question');
require('./ourpalm-ucenter/controllers/ourpalm-controller-ucenter');
require('./ourpalm-pcenter/controllers/ourpalm-controller-pcenter');

//加载计费模块的指令
require('./ourpalm-pcenter/directives/ourpalm-directive-pcenter');

//fastclick about the 300ms delay ; https://docs.angularjs.org/api/ngTouch
// var FastClick = require('fastclick');
// FastClick.attach(document.body);

//bootstrap app
angular.bootstrap(document, ['ourpalm-app']);