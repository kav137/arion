angular.module('app-core.service', [])
	.service('treeDataService', function (){
		var TDS = this;
		var tree = {};
		var localIdCounter = 0;

		var selectedNode;
	
		this.getTree = function(){
			return tree;
		}

		this.getSelectedNode = function (){
			return selectedNode;
		}

		this.initTree = function (){
			tree = 
			{
				'localId': 'root',
				'name' : 'root',
				'type': "module",
				'children': [
					{
						'localId': localIdCounter++,
						'name': 'myDevice',
						'type': "module",
						'expanded': true,
						'selected': true,
						'children': []
					}
				]
			}
		}
		
		//it doesn't affect anything if you swap unshift for push. everything would work in a proper way
		this.unshiftNode = function (parentNode, element) {
			element.localId = localIdCounter++;
			if (element.type == "module"){
				element.children = [];
				element.expanded = true;
			}
			// parentNode.children.push(element);
			parentNode.children.unshift(element);
		} 
		
		this.searchNode = function (parentNode, arglocalId){
			var outNode = {};
			outNode.parent = null;
			outNode.node = null;
			angular.forEach(parentNode.children, function (child){
				if (child.localId == arglocalId){
					outNode.parent = parentNode;
					outNode.node = child;
					return;
				}
				if (child.type == "module"){
					var retValue = TDS.searchNode(child, arglocalId);
					if (retValue && retValue.node !== null){
						outNode = retValue;
					}
				}
			});
			if(outNode.node == undefined){
				return null;
				alert('TDS.searchNode exception branch; shit happens:(')
			}
			return outNode;
		}

		this.selectNode = function (node, parentNode){
			angular.forEach(parentNode.children, function (child){
				if (child.localId == node.localId){
					child.selected = true;
					selectedNode = child;
				}
				else{
					child.selected = false;
				}
				if (child.type == "module"){
					TDS.selectNode(node, child);
				}
			})
		}
	})

	.service('elementSelectionService',['$http', function ($http){
		var eds = this;
		var data = {};

		this.init = function(){
			$http.get('resources/elements.json').
				success(function (data, status, headers, config){
					eds.data = data;
				})
		}	

		this.getData = function(){
			return eds.data;
		}	

		this.getSubGroups = function (groupId, ownerId){
			var outArray = [];
			angular.forEach(eds.data.subGroups, function (item){
				var isOwnerPresent = false;
				var isGroupPresent = false;
				angular.forEach(item.belongsTo.groupId, function (grId){
					if (grId == groupId){
						isGroupPresent = true;
					}
				})
				angular.forEach(item.belongsTo.ownerId, function (ownId){
					if (ownId == ownerId){
						isOwnerPresent = true;
					}
				})
				if (isOwnerPresent && isGroupPresent){
					outArray.push(item);
				}
			})
			return outArray;
		}
	}])

	.service('databaseService', ['$http', function ($http){
		//place here elementSelection service afterwards
		this.initProperties = function (element){
			if (!element.group || !element.owner || !element.subGroup){
				alert('invalid element. impossible to send request to db');
				return;
			}
			$http.get('resources/jsonFull.json').
				success(function (response, status, headers, config){
					element.properties = response.data.properties;
					
					angular.forEach(element.properties, function (prop){
						prop.value = null;
						if (prop.default){
							prop.value = prop.default;
						}
					})
				})
		}
	}])

angular.module('app-core.controller', ['ngRoute'])
	.controller('RootCtrl', ['$scope', 'treeDataService', 'elementSelectionService', '$rootScope', 
		function ($scope, treeDataService, elementSelectionService, $rootScope){
		$scope.treeModel = treeDataService.getTree();
		$scope.selectedNode;
		$rootScope.$on('selectedNodeUpdated', function (event, args){
			$scope.selectedNode = args;
		})
	}])

	.controller('TreeCtrl', ['$scope', '$controller', 'treeDataService', 'elementSelectionService', 'databaseService',
	function ($scope, $controller, treeDataService, elementSelectionService, databaseService){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}));
		$scope.typeTrigger = {value: "module"};
		$scope.elementData = elementSelectionService.getData();
		$scope.elementOwner;
		$scope.elementGroup;
		$scope.elementName;
		$scope.elementSubGroups;
		$scope.elementSubGroup;

		$scope.addNode = function (parentNode, newId){
			if (!parentNode){
				parentNode = (treeDataService.searchNode($scope.treeModel, '0')).node;
				$scope.selectNode(null, parentNode); 
			}
			if (parentNode.type != "module"){
				alert("you can't add nodes to element. select module please");
				return;
			}
			else{
				if (parentNode.expanded == false){
					alert("warning. you're triyng to add node to module, which children are hidden. expnand it to see changes")
				}
			}
			if ($scope.typeTrigger.value == "element" && 
				(!$scope.elementOwner || !$scope.elementSubGroup || !$scope.elementGroup)){
					alert('define group, owner, subGroup')
					return;
			}
			var element = {};
			element.name = $scope.elementName? $scope.elementName : "unnamed";
			element.type = $scope.typeTrigger.value;
			if ($scope.typeTrigger.value == "element"){
				element.group = $scope.elementGroup.groupId;
				element.owner = $scope.elementOwner.ownerId;
				element.subGroup = $scope.elementSubGroup.subGroup;
				databaseService.initProperties(element);
			}
			treeDataService.unshiftNode(parentNode, element);
		}

		//use it to select node in the tree (for further adding, removing etc.)
		$scope.selectNode = function($event, node){
			treeDataService.selectNode(node, $scope.treeModel);
			// $scope.selectedNode = treeDataService.getSelectedNode();
			if($event){
				$event.stopPropagation();
			}
			$scope.$emit('selectedNodeUpdated', node)
		}

		//BUG: when value of select is dropped by dependsOn value of scope.elementSubGroup is still assigned
		$scope.updateSubGroups = function(){
			if ($scope.elementOwner && $scope.elementGroup){
				$scope.elementSubGroups = elementSelectionService.getSubGroups($scope.elementGroup.groupId, $scope.elementOwner.ownerId);
			}
			// else{
			// 	// alert('specify group and owner')
			// }
		}

		$scope.expandModule = function ($event, module){
			module.expanded = !module.expanded;
		}

		$scope.removeNode = function (nodeToDel){
			// var nodeToDel = treeDataService.searchNode($scope.treeModel, node);
			if (nodeToDel.localId == '0'){
				alert("you can't remove device. choose antoher node")
				return;
			}
			var result = treeDataService.searchNode($scope.treeModel, nodeToDel.localId);
			var index = -1;
			for (var i = result.parent.children.length - 1; i >= 0; i--) {
				if (result.parent.children[i].localId == result.node.localId){
					index = i;
					break;
				}
			};
			if (result.node.children && result.node.children.length >= 0){
				if (confirm('this node possibly has children. are you sure that you want to remove it?') ){
					delete result.parent.children.splice(index, 1);
					$scope.selectNode(null, result.parent);
				}
			}
			else{
				if (confirm('are you sure?') ){
					delete result.parent.children.splice(index, 1);
					$scope.selectNode(null, result.parent);
				}
			}
		}

		function initCtrl (){
				parentNode = (treeDataService.searchNode($scope.treeModel, '0')).node;
				$scope.selectNode(null, parentNode); 
		}
	}]);	

/**
* app-core Module
*
* aggregator
*/
angular.module('app-core', ['ngRoute', 'app-core.service', 'app-core.controller'])
	.run(['$log', 'treeDataService', 'elementSelectionService', 
		function($log, treeDataService, elementSelectionService){
		treeDataService.initTree();
		elementSelectionService.init();
		$log.info('app-core is initialized')
	}]);