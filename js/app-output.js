/**
* app-output.controller Module
*
* Description
*/
angular.module('app-REPLACE.service', ['app-core'])
	.service('mathService', function(){
		var MS = this;

		this.calculate = function (expression, data){
			console.clear();
			console.log('calculate starts, input expression : %s', expression);
			checkSafety(expression);
			checkBrackets(expression);
			expression = replaceCommas(expression)
			expression = replaceVariables(expression, data);
			expression = replaceOperations(expression);
			console.log('calculate finished, expression: %s', expression);
			console.log('result: %f', eval(expression));
		}

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
			console.log('checkBrackets success')
		}

		var checkSafety = function (expression){
			var reservedWords = ['=', ' ', ';', 'break', 'case', 'constructor', 'delete', 'do', 'else', 'eval', 'finally', 'for',
				'function', 'goto', 'if', 'return', 'prototype', 'try', 'var', 'while'];
			angular.forEach(reservedWords, function (word){
				if(expression.indexOf(word) != -1){
					throw "A01::mathService.checkSafety: unsafe expression to be evaluated"
				}
			})
			console.log('checkSafety success')
		}

		var replaceCommas = function (expression){
			while (expression.indexOf(',') > -1){
				expression = expression.replace(',', '.');
			}
			console.log('replaceCommas success. out expression: %s', expression);
			return expression;
		}

		var replaceVariables = function (expression, data){
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
			console.log('replaceVariables success. out expression: %s', expression);
			return expression;
		}

		var replaceOperations = function (expression) {
			expression = replaceLn(expression);
			expression = replaceExp(expression);
			console.log('replaceOperations success. out expression: %s', expression);
			return expression;
		}

		var replaceLn = function (expression) {
			while (expression.indexOf('ln') > -1){
				expression = expression.replace('ln', 'Math.log');
			}
			return expression;
		}

		var replaceExp = function (expression) {
			while (expression.indexOf('exp') > -1){
				//dirty hack, but it works faster than nested checks'n'loops or regexps.
				expression = expression.replace('exp', 'Math.toReplace');
			}
			while (expression.indexOf('toReplace') > -1){
				expression = expression.replace('toReplace', 'exp');
			}
			return expression;
		}
	})

angular.module('app-output.controller', ['app-core'])
	.controller('ChartCtrl', ['$scope', '$controller', 'mathService', 
		function($scope, $controller, mathService){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}))

		$scope.trialModel = "ln(a+b*exp(c/d)+1/c-ln(c))";
		$scope.result = 123;
		$scope.ccc = 100;
		$scope.calculate = function (){
			var a = 14;
			var b = 17;
			var c = 1;
			var d = 2;
			mathService.calculate( $scope.trialModel , {'a': a, 'b': b, 'c': c, 'd': d});
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
