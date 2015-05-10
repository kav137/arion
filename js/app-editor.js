/**
* app-editor.controller Module
*
* Description
*/
angular.module('app-editor.controller', ['app-core'])
	.controller('EditorCtrl', ['$scope', '$controller',
		function ($scope, $controller){
			angular.extend(this, $controller('RootCtrl', {$scope: $scope}));
			$scope.temp = {
				value : "ghja,sd",
				data : ['une', 'deux', 'trois']
			}
			$scope.treeModel;
	}])



/**
* app-editor Module
*
* aggregator for all submodules
*/
angular.module('app-editor', ['app-editor.controller'])
	.run(['$log', function ($log){
		$log.info('app-editor is initialized')		
	}])
