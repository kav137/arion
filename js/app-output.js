/**
* app-output.controller Module
*
* Description
*/
angular.module('app-output.controller', ['app-core'])
	.controller('ChartCtrl', ['$scope', '$controller', 
		function($scope, $controller){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}))

	}]);

/**
* app-output Module
*
* Aggregator for all app-output submodules
*/
angular.module('app-output', ['app-output.controller'])
	.run(['$log' , function($log){
		$log.info('app-output is initialized');
	}]);
