/**
* app-output.controller Module
*
* Description
*/
angular.module('app-REPLACE.service', ['app-core'])
	.service('mathService', function(){
		var MS = this;

		var checkBrackets = function (expression){
			var counter = 0;
			for (var i = 0; i < expression.length; i++){
				switch (expression[i]){
					case '(':
						counter++;
						break;
					case ')':
						counter--;
						break;
				}
				if (counter < 0){
					throw "A01::mathService.checkBrackets: incorrect expression. excess closing bracket."
				}
			}
			if (counter != 0){
				throw "A01::mathService.checkBrackets: incorrect expression. unbalanced brackets"
			}
		}

		var checkSafety = function (expression){
			var reservedWords = ['=', ' ', ';', 'break', 'case', 'constructor', 'delete', 'do', 'else', 'eval', 'finally', 'for',
				'function', 'goto', 'if', 'return', 'prototype', 'try', 'var', 'while'];
			angular.forEach(reservedWords, function (word){
				if(expression.indexOf(word) != -1){
					throw "A01::mathService.checkSafety: unsafe expression to be evaluated"
				}
			})
		}

		this.replaceVariables = function (expression, data){
			// checkBrackets(expression);
			// checkSafety(expression);
			angular.forEach(data, function (value, key){
				var replaceThis = new RegExp('(?:\\+|\\-|\\/|\\*|\\(|\\^|^)('+ key +')(?:\\+|\\-|\\/|\\*|\\)|$)');
				var matchArray;
				while (matchArray = replaceThis.exec(expression)){
					var beginSubIndex;
					if (expression.charAt(matchArray.index) != matchArray[1].charAt(0)){
						beginSubIndex = matchArray.index + 1;
					}
					else{
						beginSubIndex = matchArray.index;
					}
					var begin = expression.substring(0, beginSubIndex);
					var end = expression.substring(beginSubIndex)
					expression = begin + "data." + end;
				}
			})
			return expression;
		}

		var calcLn = function (expression, data){

		}
	})

angular.module('app-output.controller', ['app-core'])
	.controller('ChartCtrl', ['$scope', '$controller', 'mathService', 
		function($scope, $controller, mathService){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}))

		$scope.trialModel = "(a+b)/((c)*d+c)";
		$scope.result = 123;
		$scope.ccc = 100;
		$scope.calculate = function (){
			var a = 14;
			var b = 17;
			var c = 1;
			var d = 2;
			console.log('result:')
			var res = mathService.replaceVariables('(a+b)/((c)*d+c)', {'a': a, 'b': b, 'c': c, 'd': d});
			console.log(res)
			// $scope.result = 14
			// console.log($scope.trialModel)
		}
	}]);

/**
* app-output Module
*
* Aggregator for all app-output submodules
*/
angular.module('app-output', ['app-output.controller', 'app-REPLACE.service'])
	.run(['$log' , function($log){
		$log.info('app-output is initialized');
	}]);
