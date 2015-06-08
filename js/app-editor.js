/**
* app-editor.controller Module
*
* Description
*/
angular.module('app-editor.controller', ['app-core'])
	.controller('EditorCtrl', ['$scope', '$controller', 'treeDataService', 'mathService', "$filter",
		function ($scope, $controller, treeDataService, mathService, $filter){
			angular.extend(this, $controller('RootCtrl', {$scope: $scope}));

			$scope.coefficients; //this would be stored all the coef-s and prop-s with their values
			$scope.calculateReliability = function(){
				var backupSelected = $scope.selectedNode;

				if($scope.selectedNode.type == "element"){
					$scope.calculateElementReliability();
				}
				if($scope.selectedNode.type == "module"){
					var summary = 0;
					var children = treeDataService.getChildrenArray($scope.selectedNode);
					angular.forEach(children, function(child){
						$scope.selectNode(null, child);
						if(child.modelValue == undefined){
							$scope.calculateElementReliability();
						}
						console.log($scope.selectedNode.modelValue)
						summary = summary + $scope.selectedNode.modelValue;	
					})
					$scope.selectNode(null, backupSelected)
					$scope.selectedNode.summaryModelValue = summary;
					$scope.selectedNode.summaryModelQuantity = children.length;
				}
				// console.clear()
			}
			$scope.calculateElementReliability = function (){
				try{
					var keysArray = initKeys();
					var varObj = calculateCoefficients(keysArray);
					calculateModel(varObj);
				}
				catch (error){
					alert("Необходимо заполнить все требуемые поля")
				}
			}

			var initKeys = function(){
				var keys = [];
				// // console.clear();
				angular.forEach($scope.selectedNode.properties, function (item){
					//handling number inputs
					if (item.type == 2 || item.type == 1){
						var obj = {};
						obj.key = item.key;
						obj.value = parseFloat(item.value.replace(',', '.'))
						keys.push(obj)
					}
					//handling drop down lists
					if (item.type == 4){
						//handling nested dependent properties
						angular.forEach(item.value.properties, function (innerProperty){
							var obj = {};
							obj.key = innerProperty.key;
							if(innerProperty.value != undefined){
								if ((typeof innerProperty.value) == "string"){
									obj.value = parseFloat((innerProperty.value).replace(',', '.'));
								}
								else{
									obj.value = parseFloat(innerProperty.value);
								}
							}
							else{
								if ((typeof innerProperty.default) == "string"){
									obj.value = parseFloat((innerProperty.default).replace(',', '.'));
								}
								else{
									obj.value = parseFloat(innerProperty.default);
								}
							}
							keys.push(obj)
						});
						//handling nested non-editable keys
						angular.forEach(item.value.keys, function (innerKey){
							var obj = {};
							obj.key = innerKey.key;
							if(innerKey.value != undefined){
								if ((typeof innerKey.value) == "string"){
									obj.value = parseFloat((innerKey.value).replace(',', '.'))
								}
								else{
									obj.value = parseFloat((innerKey.value))
								}
							}
							else{
								if ((typeof innerKey.default) == "string"){
									obj.value = parseFloat((innerKey.default).replace(',', '.'))
								}
								else{
									obj.value = parseFloat((innerKey.default))
								}
							}
							keys.push(obj)
						})
					}
				});
				return keys;
			}

			var calculateCoefficients = function (keysArray){
				var varObj = {};
				angular.forEach($scope.selectedNode.coefficients, function (coef){
					angular.forEach(keysArray, function (item){
						varObj[item.key] = item.value;
					})
					coef.value = mathService.calculate(coef.formula, varObj)
				})
				return varObj;
			}

			var calculateModel = function (varObj){
				angular.forEach($scope.selectedNode.coefficients, function (item){
					varObj[item.key] = item.value;
				})
				$scope.selectedNode.modelValue = mathService.calculate($scope.selectedNode.method, varObj);
				$scope.coefficients = varObj;
			}

			$scope.removeNode = function (nodeToDel){
				// var nodeToDel = treeDataService.searchNode($scope.treeModel, node);
				if (nodeToDel.localId == '0'){
					alert("you can't remove device. choose antoher node")
					return;
				}
				var result = treeDataService.searchNode($scope.treeModel, nodeToDel.localId);
				var resultFromArray = $filter('filter')($scope.$parent.$parent.treeAsList, {localId: '!' + nodeToDel.localId})
				$scope.$parent.$parent.treeAsList = resultFromArray; //removing form list
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
