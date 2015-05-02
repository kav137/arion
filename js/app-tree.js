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

		//UNCHANGED VERSION
		// this.pushNode = function (type, parentNode, id) {
		// 	var object = {};
		// 	object.localId = localIdCounter++;
		// 	object.name = id;
		// 	object.type = type;
		// 	if (type == "module"){
		// 		object.children = [];
		// 	}
		// 	parentNode.children.push(object);
		// }
		
		this.pushNode = function (parentNode, element) {
			element.localId = localIdCounter++;
			if (element.type == "module"){
				element.children = [];
			}
			parentNode.children.push(element);
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

	.service('elementDataService',['$http', function ($http){
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

		/**
		 * maybe there is a sense to define subGroups in .json file
		 * this way
		 * 	[..{
		 * 	'id': 'smth',
		 * 	'subGroup': 'smth',
		 * 	'group': 'smth',
		 * 	'owner': 'smth'
		 * 	}..]
		 *
		 * it allows to use $filter
		 *
		 * owners and groups would be stored separately (groups.json)
		 * so, editors would be formed using groups.json
		 */
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

angular.module('app-tree.controller', ['ngRoute'])
	.controller('TreeCtrl', ['$scope', 'treeDataService', 'elementDataService',
	function ($scope, treeDataService, elementDataService){
		//RENAME ELEMENTTYPE -> SUBGROUP
		$scope.treeModel = treeDataService.getTree();
		$scope.selectedNode;
		$scope.typeTrigger = {value: "module"};

		$scope.elementData = elementDataService.getData();
		$scope.elementOwner;
		$scope.elementGroup;
		$scope.elementName;
		$scope.elementTypes;
		$scope.elementType;

		// $scope.searchNode = function()
		$scope.addNode = function (parentNode, newId){
			if (!parentNode || parentNode.type != "module"){
				alert('please select module');
				return;
			}
			// if (!$scope.elementName ||
			// 		!$scope.typeTrigger || 
			// 		!$scope.elementGroup ||
			// 		!$scope.elementOwner ||
			// 		!$scope.elementType){
			// 	alert('define params')
			// 	return
			// }
			if ($scope.typeTrigger.value == "element" && 
				(!$scope.elementOwner || !$scope.elementType || !$scope.elementGroup)){
					alert('define group, owner, subGroup')
					return;
			}
			var element = {};
			element.name = $scope.elementName? $scope.elementName : "unnamed";
			element.type = $scope.typeTrigger.value;
			if ($scope.typeTrigger.value == "element"){
				element.group = $scope.elementGroup.groupId;
				element.owner = $scope.elementOwner.ownerId;
				element.subGroup = $scope.elementType.subGroup;
			}
			treeDataService.pushNode(parentNode, element);
			console.log("scope tree");
			console.log($scope.treeModel)
			console.log("**************");
			console.log("service tree");
			console.log(treeDataService.getTree())

		}

		$scope.selectNode = function($event, node){
			treeDataService.selectNode(node, $scope.treeModel);
			$scope.selectedNode = node;
			if($event){
				$event.stopPropagation();
			}
		}
		//BUG: when value of select is dropped by dependsOn value of scope.elementSubGroup is still assigned
		$scope.updateSubGroups = function(){
			if ($scope.elementOwner && $scope.elementGroup){
				$scope.elementTypes = elementDataService.getSubGroups($scope.elementGroup.groupId, $scope.elementOwner.ownerId);
			}
			// else{
			// 	// alert('specify group and owner')
			// }
		}

		//useless stuff yet
		$scope.deleteNode = function (node){
			var nodeToDel = treeDataService.searchNode($scope.treeModel, node);
			delete nodeToDel;
		}

	}]);	

/**
* app-tree Module
*
* aggregator
*/
angular.module('app-tree', ['ngRoute', 'app-tree.service', 'app-tree.controller'])
	.run(['$log', 'treeDataService', 'elementDataService', 
		function($log, treeDataService, elementDataService){
		treeDataService.initTree();
		elementDataService.init();
		$log.info('app-tree is initialized')
	}]);