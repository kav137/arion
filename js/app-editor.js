/**
* app-editor.controller Module
*
* Description
*/
angular.module('app-editor.controller', ['app-core'])
	.controller('EditorCtrl', ['$scope', '$controller', 'treeDataService', 'mathService',
		function ($scope, $controller, treeDataService, mathService){
			angular.extend(this, $controller('RootCtrl', {$scope: $scope}));

			$scope.setValue = function (prop){
				// alert('asd');
				console.clear();
				console.log(prop)
			}

			$scope.checkValue = function(){
				// isNumber?
			}

			$scope.selectProperty = function (answer, answers){
				angular.forEach(answers, function (item) {
					if (item != answer){
						item.selected = false;
					}
					else{
						item.selected = true;
					}
				})
				console.clear();
				console.log($scope.selectedNode)
			}
			
			$scope.calcCoef = function(){
				var keys = [];
				console.clear();
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
				console.clear();
				console.log(keys)

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
