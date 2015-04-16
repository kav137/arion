angular.module('app-tree.service', [])
	.service('treeDataService', function (){
		//use tds var inside angularjs functions (like foreach), 'cause 
		//angular creates it's own 'this' scope
		var tds = this;
		var tree = {};
		var localIdCounter = 0;
	
		this.getTree = function(){
			return tree;
		}

		this.initTree = function (){
			tree = 
			{
				'localId': 'root',
				'name' : 'root',
				'type': "module",
				'children':
				[
					{
						'localId': localIdCounter++,
						'type': "module",
						'name' : 'myDevice',
						'children':[]
					}
				]
			}
		}

		this.pushNode = function (type, parentNode, id) {
			var object = {};
			object.localId = localIdCounter++;
			object.name = id;
			object.type = type;
			if (type == "module"){
				object.children = [];
			}
			parentNode.children.push(object);
		}

		this.searchNode = function (argModule, argId){
			var outValue = {};
			angular.forEach(argModule.children, function (child){
				if (child.localId == argId){
					outValue = child;
					return;
				}
				if (child.type == "module"){
					var retValue = tds.searchNode(child, argId);
					if (retValue !== null){
						outValue = retValue;
					}
				}
			});
			if(outValue.localId == undefined){
				return null;
			}
			return outValue;
		}

		this.selectNode = function (node, parentNode){
			angular.forEach(parentNode.children, function (child){
				if (child.localId == node.localId){
					child.selected = true;
				}
				else{
					child.selected = false;
				}
				if (child.type == "module"){
					tds.selectNode(node, child);
				}
			})
		}
	})

angular.module('app-tree.controller', ['ngRoute'])
	.controller('TreeCtrl', ['$scope', 'treeDataService', 
	function ($scope, treeDataService){
		$scope.treeModel = treeDataService.getTree();
		$scope.selectedNode;
		// $scope.searchNode = function()
		$scope.addNode = function (type, parentNode, newId){
			if (!parentNode || parentNode.type != "module"){
				alert('please select module');
				return;
			}
			treeDataService.pushNode(type, parentNode, newId)
		}
		$scope.selectNode = function($event, node){
			treeDataService.selectNode(node, $scope.treeModel);
			$scope.selectedNode = node;
			if($event){
				$event.stopPropagation();
			}
		}
		$scope.deleteNode = function (node){
			var nodeToDel = treeDataService.searchNode($scope.treeModel, node);
			delete nodeToDel;
		}
		$scope.useless = function(){
			alert('aa')
			console.log(treeDataService.searchNode($scope.treeModel, '3'));
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