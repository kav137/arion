angular.module('app-tree.service', [])
	.service('treeDataService', function (){
		var tree = {};
		//todel
		this.getTree = function(){
			return tree;
		}
		this.initTree = function (){
			tree = 
			{
				'id': 'root',
				'type': "module",
				'children':
				[
					{
						'id': 1,
						'type': "module",
						'children':
						[
							{
								'id':11,
								'type': "element"
							},
							{
								'id':12,
								'type': "module",
								'children':
								[
									{
										'id': 121,
										'yeap' : true,
										'type': "element"
									}
								]
							}
						]
					},
					{
						'id': 2,
						'type': "module",
						'children':[]
					},
					{
						'id': 3,
						'type': "module",
						'children':
						[
							{
								'id': 31,
								'type': "element"
							}
						]
					}
				]
			}
			console.log('built')
		}
		this.pushNode = function (type, parentId, id) {
			var object = {};
			object.id = id;
			object.type = type;
			if (type == "module"){
				object.children = [];
			}
			var parentNode = recursiveSearch(tree, parentId);
			if (!parentNode){
				throw new Error('impossible to find parent during pushing');
			}
			if (!parentNode.children){
				throw new Error('parent has no children (pushing)');
			}
			parentNode.children.push(object);
			console.log(tree);
		}
		this.searchNode = function (argModule, argId){
			return recursiveSearch(argModule, argId);
		}
		var recursiveSearch = function (argModule, argId){
			var outValue = {};
			angular.forEach(argModule.children, function (child){
				if (child.id == argId){
					outValue = child;
					return;
				}
				if (child.type == "module"){
					var retValue = recursiveSearch(child, argId);
					if (retValue !== null){
						outValue = retValue;
					}
				}
			});
			if(!outValue.id){
				return null;
			}
			return outValue;
		}
	});

angular.module('app-tree.controller', ['ngRoute'])
	.controller('TreeCtrl', ['$scope', 'treeDataService', 
	function ($scope, treeDataService){
		$scope.treeModel = treeDataService.getTree();
		$scope.addNode = function (type, parentId, newId){
			treeDataService.pushNode(type, parentId, newId)
		}
	}]);	

/**
* app-tree Module
*
* aggregator
*/
angular.module('app-tree', ['ngRoute', 'app-tree.service', 'app-tree.controller'])
	.run(['$log', 'treeDataService', function($log, treeDataService){
		treeDataService.initTree();
		$log.info('app-tree is initialized')
	}]);