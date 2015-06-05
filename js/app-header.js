/**
* app-header.controller Module
*
* Description
*/
angular.module('app-header.controller', ['app-core'])
	.controller('HeaderCtrl', ['$scope', '$rootScope', '$controller', 'appStateService',
		function($scope, $rootScope, $controller, appStateService){
			angular.extend(this, $controller('RootCtrl', {$scope: $scope}))
			$scope.addElementHeader = function (){
				// alert($scope.showModal)
				$scope.$parent.$parent.modal = true;
				appStateService.isModalShown = true;
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