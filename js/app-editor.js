/**
* app-editor.controller Module
*
* Description
*/
angular.module('app-editor.controller', ['app-core'])
	.controller('EditorCtrl', ['$scope', '$controller', '$rootScope', 'treeDataService', 'mathService', "$filter", 'chartService', 'calculateService',
		function ($scope, $controller, $rootScope, treeDataService, mathService, $filter, chartService, calculateService){
			angular.extend(this, $controller('RootCtrl', {$scope: $scope}));

			$scope.coefficients; //this would be stored all the coef-s and prop-s with their values

			$scope.$watch("selectedNode", function (){
				$scope.calculateReliability();
			})

			$scope.calculateReliability = function(){
				if(!$scope.selectedNode){
					return;
				}
				if($scope.selectedNode.type == "element"){
					$scope.calculateElementReliability($scope.selectedNode);
				}
				if($scope.selectedNode.type == "module"){
					var summary = 0;
					var children = treeDataService.getChildrenArray($scope.selectedNode);
					angular.forEach(children, function(child){
						$scope.calculateElementReliability(child);
						summary = summary + child.modelValue;
					});
					$scope.selectedNode.summaryModelValue = summary;
					$scope.selectedNode.summaryModelQuantity = children.length;
				}
				chartService.updateCharts(angular.copy($scope.selectedNode));
			}
			
			$scope.calculateElementReliability = function (element){
				try{
					var keysArray = calculateService.initKeys(element);
					if (keysArray.some(function (item){
						return isNaN(item.value);
					})){
						throw "empty field"
					}
					// (!!!) TODO: refactor this block 'cause varObj doesn't require extension
					var varObj = calculateService.calculateCoefficients(element, keysArray);
					var coefficientsOut = calculateService.extendVarObjWithCoefs(element, varObj); //not required anymore
					calculateService.calculateModel(element, coefficientsOut);
					$scope.coefficients = coefficientsOut;
				}
				catch (error){
					alertify.error(error.message);
					// alertify.error($filter('translate')("Parameters required"));
				}
			}

			$scope.removeNode = function (nodeToDel){
				if (nodeToDel.localId == '0'){
					alertify.error($filter('translate')('Remove device'));
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
					if (confirm($filter('translate')('Remove module?')) ){
						delete result.parent.children.splice(index, 1);
						$scope.selectNode(null, result.parent);
					}
				}
				else{
					if (confirm($filter('translate')('Remove element?')) ){
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
		$log.info('app-editor initialized successfully')		
	}])
