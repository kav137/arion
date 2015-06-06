/**
* app-header.controller Module
*
* Description
*/
angular.module('app-header.controller', ['app-core'])
	.controller('HeaderCtrl', ['$scope', '$rootScope', '$controller', 'appStateService',
		function($scope, $rootScope, $controller, appStateService){
			angular.extend(this, $controller('RootCtrl', {$scope: $scope}))

			$scope.addElement = function (){
				var modalConfig = {};
				modalConfig.visible = true;
				modalConfig.type = "addElementModal";
				$scope.$parent.$parent.modal = modalConfig;
			}

			$scope.addModule = function (){
				var modalConfig = {};
				modalConfig.visible = true;
				modalConfig.type = "addModuleModal";
				$scope.$parent.$parent.modal = modalConfig;
			}
			$scope.later = function (){
				alert("Работа данной функции находится на последнем этапе тестирования. Все тестируемые функции настолько хороши, что обязательно войдут в следующий релиз")
			}
			$scope.logout = function(){
				if (confirm("Вы уверены, что хотите выйти из своего аккаунта?"))
					$scope.$parent.$parent.authorization.success = false;
			}
			$scope.stopBubbling = function($event){
				$event.stopPropagation();
			}
	}])

/**
* app-header Module
*
* Aggregator for all submodules
*/
angular.module('app-header', ['app-header.controller'])
	.run(['$log', function($log){
		$log.info('app-header initialized successfully');
	}])