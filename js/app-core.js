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
						'name': 'Мое устройство',
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

		this.getChildrenArray = function(parentNode){
			var outArray = [];
			angular.forEach(parentNode.children, function(child){
				if(child.type == 'element'){
					outArray.push(child);
				}
				if(child.type == 'module'){
					outArray = outArray.concat(TDS.getChildrenArray(child))
				}
			});
			return outArray;
		}

		this.getElementParent = function (element, parent){
			var out;
			if (parent === undefined){
				parent = tree;
			}
			angular.forEach(parent.children, function (child){
				if(child.type == 'element' && child.localId === element.localId){
					out =  parent;
					return;
				}
				if(child.type == 'module'){
					// outArray = outArray.concat(TDS.getChildrenArray(child))
					
				}
			});
			return out;
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

		this.getElements = function(){
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

			//client version
			if (element.subGroup.length == 8){
				var fileName = "resources/capacitors.json";
			}
			else{
				var fileName = "resources/micro.json";
			}
			$http.get(fileName).
				success(function (response, status, headers, config){
					element.properties = response.data.properties;
					element.coefficients = response.data.coefficients;
					element.method = response.data.method;
					
					//initializing default values
					angular.forEach(element.properties, function (prop){
						prop.value = null;
						if (prop.default){
							if (prop.type == "1" || prop.type == "2"){
								prop.value = prop.default;
							}
							if (prop.type == "4"){
								prop.value = prop.answers[parseInt(prop.default)];
							}
						}
					})

					angular.forEach(element.coefficients, function (coef){
						coef.value = null;
					})
				})

			//server version
			// /arion?cn=INDIFFERENT&gn=Слюдяные&mt=Отечественная методика
			// do not escape characters
			
			/*var str = "\\arion\\arion?cn=" + element.group +
					'&gn=' + element.subGroup + "&mt=" + element.owner;
					// console.log(str)
			$http.get(str).
				success(function (response, status, headers, config){
					element.properties = response.data.properties;
					element.coefficients = response.data.coefficients;
					element.method = response.data.method;
					
					angular.forEach(element.properties, function (prop){
						prop.value = null;
						if (prop.default){
							prop.value = prop.default;
						}
					})

					angular.forEach(element.coefficients, function (coef){
						coef.value = null;
					})
				}).
				error(function (response, status, headers, config){
					alert("http-request error. app-core: 141")
				})*/

		}
	}])

angular.module('app-core.controller', ['ngRoute'])
	.controller('RootCtrl', ['$scope', 'treeDataService', 'elementSelectionService', '$rootScope', '$http',
		function ($scope, treeDataService, elementSelectionService, $rootScope, $http){

		//device data
		$scope.treeModel = treeDataService.getTree();
		$scope.treeAsList = [];
		$scope.selectedNode;

		//authorization data
		$scope.authorization ={};
		$scope.authorization.success = true; //require compelete rewriting
		$scope.authorization.userName = "";
		$scope.authorization.password = "";

		//state data
		$scope.modal = {
			type: undefined,
			visible: false,
		};

		//settings data
		

		$scope.login = function(){
				$http.get("\\arion\\login?ul="+$scope.authorization.userName + "&up=" + $scope.authorization.password).
					success(function (response, status, headers, config){
						// console.log(response)
						if(response.data.auth == "true"){
							$scope.authorization.success = true;
						}
						else{
							alert('wrong credentials!')
						}
					})
		}
		$rootScope.$on('selectedNodeUpdated', function (event, args){
			$scope.selectedNode = args;
		})

		//use it to select node in the tree (for further adding, removing etc.)
		$scope.selectNode = function($event, node){
			treeDataService.selectNode(node, $scope.treeModel);
			// $scope.selectedNode = treeDataService.getSelectedNode();
			if($event){
				$event.stopPropagation();
			}
			$scope.$emit('selectedNodeUpdated', node)
		}
	}])

	.controller('AddElementCtrl', ['$scope', '$controller', 'treeDataService', 'elementSelectionService', 'databaseService', '$rootScope',
		function($scope, $controller, treeDataService, elementSelectionService, databaseService, $rootScope){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}));
		$scope.isShownAsList = false;
		$scope.typeTrigger = {value: "element"}; //to be depricated
		$scope.elementData = elementSelectionService.getElements();
		$scope.elementOwner = $scope.elementData.owners[0];
		$scope.elementGroup = $scope.elementData.groups[0];
		$scope.elementName;
		$scope.elementPosition;
		$scope.elementSubGroups;
		$scope.elementSubGroup;

		$scope.addNode = function (parentNode, newId, isModule){
			if (!parentNode){
				parentNode = (treeDataService.searchNode($scope.treeModel, '0')).node;
				$scope.selectNode(null, parentNode); 
			}
			if (parentNode.type != "module"){
				// alert("you can't add nodes to element. select module please");
				// return;
				parentNode = treeDataService.getElementParent(parentNode);
			}
			else{
				// if (parentNode.expanded == false){
				// 	alert("warning. you're triyng to add node to module, which children are hidden. expnand it to see changes")
				// }
			}
			if ($scope.typeTrigger.value == "element" && 
				(!$scope.elementOwner || !$scope.elementSubGroup || !$scope.elementGroup)){
					alert('define group, owner, subGroup')
					return;
			}
			var element = {};
			element.name = $scope.elementName? $scope.elementName : "Безымянный";
			element.type = $scope.typeTrigger.value;
			element.position = $scope.elementPosition;
			if(isModule != undefined){
				element.type = "module"
			}
			if (isModule == undefined){
				element.group = $scope.elementGroup.groupId;
				element.owner = $scope.elementOwner.ownerId;
				element.subGroup = $scope.elementSubGroup.subGroup;
				databaseService.initProperties(element);
				$scope.$parent.treeAsList.push(element);
			}
			treeDataService.unshiftNode(parentNode, element);
			$scope.elementName = "";
			$scope.elementPosition = "";
		}

		

		//BUG: when value of select is dropped by dependsOn value of scope.elementSubGroup is still assigned
		$scope.updateSubGroups = function(){
			if ($scope.elementOwner && $scope.elementGroup){
				$scope.elementSubGroups = elementSelectionService.getSubGroups($scope.elementGroup.groupId, $scope.elementOwner.ownerId);
				$scope.elementSubGroup = $scope.elementSubGroups[0];
			}
			// else{
			// 	// alert('specify group and owner')
			// }
		}

		$scope.initHandler = function (){
			$scope.updateSubGroups();
			$scope.selectNode(null, (treeDataService.searchNode($scope.treeModel, '0')).node);
		}

		$rootScope.$on("appInitialized", $scope.initHandler())
	}])

	.controller('TreeCtrl', ['$scope', '$controller', 'treeDataService', 'elementSelectionService', 'databaseService', '$rootScope', '$filter',
	function ($scope, $controller, treeDataService, elementSelectionService, databaseService, $rootScope, $filter){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}));

		$scope.searchName;
		$scope.searchPosition;

		$scope.filterSettings ={};
		$scope.filterSettings.displayName;
		$scope.filterSettings.displayPosition;
		$scope.filterSettings.displayClass;
		$scope.filterSettings.displayType;
		$scope.filterSettings.displayReliability;

		$scope.initFiltering = function(){
			$scope.$parent.modal.visible = true;
			$scope.$parent.modal.type = "filterTreeModal";
		}
		$scope.initSearch = function(){
			$scope.$parent.modal.visible = true;
			$scope.$parent.modal.type = "searchElementModal";
		}

		$scope.search = function(){
			var result = $filter('filter')($scope.$parent.treeAsList, {'name': $scope.searchName, 'position': $scope.searchPosition});
			if(result.length == 1){
				$scope.selectNode(null, result[0]);
				$scope.$parent.modal.visible = false;
			}
			else{
				if (result.length == 0){
					alert($filter('translate')('Nothing found'))
				}
				else{
					alert($filter('translate')('Too much elements found'))
				}
				return;
			}
		}

		$scope.expandModule = function ($event, module){
			module.expanded = !module.expanded;
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
		$log.info('app-core initialized successfully')
	}]);