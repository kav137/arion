"use strict"
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
				alertify.error('TDS.searchNode exception branch; shit happens:(')
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
	
	.service('elementSelectionService',['$http', '$rootScope', function ($http, $rootScope){
		var eds = this;
		var data = {};

		this.init = function(){
			$http.get('\\arion\\getInfo').
				success(function (data, status, headers, config){
					eds.data = data;
					console.log("successfully initialized : ", data);
					$rootScope.$broadcast('gotElementsInfo');
				})
		}	

		this.getElements = function(){
			return eds.data.data;
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

	.service('databaseService', ['$http', '$rootScope', function ($http, $rootScope){
		//place here elementSelection service afterwards
		this.loadElement = function (element){
			if (!element.group || !element.owner || !element.subGroup){
				alertify.error('invalid element. impossible to send request to db');
				return;
			}

			//client version
			/*if (element.subGroup.length == 8){
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
						if (prop.Default){
							if (prop.Type == "1" || prop.Type == "2"){
								prop.value = prop.Default;
							}
							if (prop.Type == "4"){
								prop.value = prop.Answer[parseInt(prop.Default)];
							}
						}
					})

					angular.forEach(element.coefficients, function (coef){
						coef.value = null;
					})
				})*/

			//server version
			// /arion?cn=INDIFFERENT&gn=Слюдяные&mt=Отечественная методика
			// do not escape characters
			
			var str = "\\arion\\arion?cn=" + element.group +
					'&gn=' + element.subGroup + "&mt=" + element.owner;

			// alertify.log("loading")
			$rootScope.loading = true;
			$http.get(str).
				success(function (response, status, headers, config){
					if (response.data === "Вы не авторизованы"){
						alert('your session has expired. please logout and login again');
						return;
					}
					element.properties = response.data.properties;
					element.coefficients = response.data.coefficients;
					element.method = response.data.method;
					initProperties(element);
					

					angular.forEach(element.coefficients, function (coef){
						coef.value = null;
					})
					// alertify.success("initialized")
					$rootScope.loading = false;
				}).
				error(function (response, status, headers, config){
					alertify.error("Ошибка взаимодействия с сервером. app-core: 220")
				})

		}

		//initializing default values
		var initProperties =  (element) => {
			element.properties.forEach(initProperty);
		};

		var initProperty = (p) => {
			p.value = null;
			if (p.Default){
				if (p.Type === undefined){ //constant-like
					p.value = p.Default;
				}
				if (p.Type == "1" || p.Type == "2"){
					initSimpleProperty(p);
				}
				if (p.Type == "4"){
					initComplexProperty(p);
				}
			}
			else {
				throw `property '${p.Name}' doesn't have default value`;
			}
		}

		var initSimpleProperty = (p) => {
			p.value = p.Default;
		}

		var initComplexProperty = (p) => {
			p.value = p.Answer[n(p.Default)];
			if (p.value.Property && angular.isArray(p.value.Property)){
				if(p.value.Property.length === 1){
					initProperty(p.value.Property[0]);	
				}
				else {
					throw `initComplexProperty :: property.value.Property.length !== 1. Name : ${p.value.Name}`;
				}
			}
			if (p.value.Key && angular.isArray(p.value.Key)){
				p.value.Key.forEach(initProperty);
			}
		}

		//parse number from string
		var n = (string) => parseInt(string, 10);
		// var setNestedValues = (val) => {
		// 	//added 13.04
		// 	if (val.Key && angular.isArray(val.Key)){
		// 		val.Key.forEach(function (subKey){
		// 			subKey.value = null;
		// 			//copy-paste from the outer block
		// 			if (subKey.Type == "1" || subKey.Type == "2"){
		// 				subKey.value = subKey.Default;
		// 			}
		// 			if (subKey.Type == "4"){
		// 				subKey.value = subKey.Answer[parseInt(subKey.Default)];

		// 				setNestedValues(subKey.value);
		// 				//one more nesting
		// 				if (subKey.value.Answer) {
		// 					debugger;
		// 					console.log("app-core 266");
		// 				}
		// 			}
		// 		})
		// 	}
		// 	if (val.Answer && angular.isArray(val.Answer)){ //PROPERTY[0]
		// 		val.value = null;
		// 		val.value = val.Answer[parseInt(val.Default)]; //possible mistakes here 
		// 		/*вид намотки -> вид изоляции провода - эмалево-волокн - марка провода - Default = 0.0...013 wtf?*/
		// 	}
		// }
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
		$scope.authorization.success = false; //require compelete rewriting
		$scope.authorization.userName = "admin";
		$scope.authorization.password = "admin";

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
							elementSelectionService.init();
						}
						else{
							alertify.error('wrong credentials!')
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

		//auto login
		// $scope.login();

	}])

	.controller('AddElementCtrl', ['$scope', '$controller', '$filter', 'treeDataService', 'elementSelectionService', 'databaseService', '$rootScope',
		function($scope, $controller, $filter, treeDataService, elementSelectionService, databaseService, $rootScope){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}));
		$scope.isShownAsList = false;
		$scope.typeTrigger = {value: "element"}; //to be depricated

		$scope.$on('gotElementsInfo', function (){
			$scope.elementData = elementSelectionService.getElements();
			$scope.elementGroup = $scope.elementData[0];
			console.log('added modal values : ', $scope.elementData)
		})
		$scope.elementOwners = [
			{
				name : 'Отечественная',
				value : 'native'
			},
			{
				name: "Зарубежная",
			 	value : 'foreign'
			}
	 	];
		$scope.elementOwner = $scope.elementOwners[0];
		$scope.$watch('elementGroup', function (newValue){
			updateSubGroups();
		});
		$scope.$watch('elementOwner', function (newValue){
			updateSubGroups();
		})
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
				alertify.error($filter('translate')('Add to element'));
				return;
				// parentNode = treeDataService.getElementParent(parentNode);
			}
			else{
				if (parentNode.expanded == false){
					alertify.log($filter('translate')('Add to close module'));
				}
			}
			if ($scope.typeTrigger.value == "element" && 
				(!$scope.elementOwner || !$scope.elementSubGroup || !$scope.elementGroup)){
					alertify.error($filter('translate')('Define initial parameters'))
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
				element.group = $scope.elementGroup.className[0];
				element.owner = $scope.elementOwner.name;
				element.subGroup = $scope.elementSubGroup;
				databaseService.loadElement(element);
				$scope.$parent.treeAsList.push(element);
			}
			treeDataService.unshiftNode(parentNode, element);
			$scope.elementName = "";
			$scope.elementPosition = "";
		}

		

		//BUG: when value of select is dropped by dependsOn value of scope.elementSubGroup is still assigned
		var updateSubGroups = function(){
			if ($scope.elementData){
				var subGroupsArray = $scope.elementGroup.groups[0][$scope.elementOwner.value][0].groupName;
				if (subGroupsArray && subGroupsArray.length){
					$scope.elementSubGroups = $scope.elementGroup.groups[0][$scope.elementOwner.value][0].groupName;
					$scope.elementSubGroup = $scope.elementSubGroups[0];
				}
				else{
					// $scope.elementSubGroups.length = 0;
					$scope.elementSubGroup = "";
					alertify.error($filter("translate")("Subgroups unavailable"));
				}
			}
		}

		$scope.initHandler = function (){
			updateSubGroups();
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
					alertify.error($filter('translate')('Nothing found'))
				}
				else{
					alertify.log($filter('translate')('Too much elements found'))
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
		// elementSelectionService.init();
		$log.info('app-core initialized successfully')
	}]);