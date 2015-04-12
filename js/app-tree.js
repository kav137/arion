angular.module('app-tree.service', [])
	.factory('moduleFactory', function(){
		return function createModule(modName){
			var module = {"children": [], "moduleName": modName};
			return module;
		};
	})
	.factory('elementFactory', function(){
		return function name(){
			
		};
	})
	.service('treeDataService', function(){
		this.data = ['ready', 'set', 'go'];
		var tree = [];
		this.getTree = function () {
			return angular.extend({}, tree);
		}
		this.pushNode = function (arg) {
			tree.push(arg);
		}
	});

angular.module('app-tree.controller', ['ngRoute'])
	.controller('TreeCtrl', ['$scope', 'treeDataService', 'moduleFactory', 
	function ($scope, treeDataService, moduleFactory){
		$scope.tree = treeDataService.getTree();
		$scope.pushValue = function (arg) {
			treeDataService.pushNode(arg);
			$scope.tree = treeDataService.getTree();
			// var mod = moduleFactory.createModule(arg);
			// console.log(mod);
			console.log(moduleFactory(arg))
		}
	}]);

/**
* app-tree Module
*
* aggregator
*/
angular.module('app-tree', ['ngRoute', 'app-tree.service', 'app-tree.controller'])
	.run(['$log', function($log){
		$log.info('app-tree is initialized')
	}]);