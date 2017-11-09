(function (angular) {

    angular.module('ourpalm-app')

        .controller('PCenter_TopController', [function () {
            var vm = this;
            vm.showDetail = false;

            vm.toggleShowDetail = function () {
                vm.showDetail = !vm.showDetail;
            };
        }])

        .controller('PCenter__PhoneController', ['$rootScope', 'PayService', 'toast', 'Util', function ($rootScope, PayService, toast, Util) {
            var vm = this;
            //中国移动
            vm.username1 = '';
            vm.password1 = '';
            //中国联通
            vm.username2 = '';
            vm.password2 = '';
            //中国电信
            vm.username3 = '';
            vm.password3 = '';
            //当前用户选择的支付方式
            vm.cardType = 1; //默认为1 中国移动

            vm.charge = function () {
                var username, password;
                switch (vm.cardType) {
                    case 1:
                        username = vm.username1;
                        password = vm.password1;
                        break;
                    case 2:
                        username = vm.username2;
                        password = vm.password2;
                        break;
                    case 3:
                        username = vm.username3;
                        password = vm.password3;
                        break;
                }

                if (Util.isEmpty(username)) return toast.translate('t2_key1');//'卡号不能为空'
                if (Util.isEmpty(password)) return toast.translate('t2_key2');//'密码不能为空'

                PayService.payByPhoneCard(vm.cardType, username, password)
                    .success(function (result) {
                        console.info(result);
                        if (result.common.status != '0') {
                            // return alert(result.common.desc);
                            $rootScope.payTime = new Date();
                            $rootScope.errorCode = result.common.reset;
                            $rootScope.errorMsg = result.common.desc;
                            $rootScope.goto('pcenter/payfailure');
                        } else {
                            $rootScope.goto('pcenter/paysuccess');
                        }
                    });
            };

            vm.changePhoneCardType = function (cardType) {
                vm.cardType = cardType;
            }
        }]);

})(angular);