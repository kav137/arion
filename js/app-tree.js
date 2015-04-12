angular.module('app-tree.service', [])
	.service('treeDataService', function(){
		this.data = ['ready', 'set', 'go'];
		var tree = [];
		this.getTree = function () {
			return angular.extend({}, tree);
		}
		this.pushItem = function (arg) {
			tree.push(arg);
		}
	});

angular.module('app-tree.controller', ['ngRoute'])
	.controller('TreeCtrl', ['$scope', 'treeDataService', function ($scope, treeDataService){
		$scope.tree = treeDataService.getTree();
		$scope.pushValue = function (arg) {
			treeDataService.pushItem(arg);
			$scope.tree = treeDataService.getTree();
		}
	}]);

/**
* app-tree.service Module
*
* Description
*/


/**
* app-tree Module
*
* aggregator
*/
angular.module('app-tree', ['ngRoute', 'app-tree.service', 'app-tree.controller'])
	.run(['$log', function($log){
		$log.info('app-tree is initialized')
	}]);