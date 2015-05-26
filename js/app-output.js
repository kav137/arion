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
			expression = replaceOperations(expression);
			expression = replaceVariables(expression, data);
			console.log("*****************")
			initCalculation(expression, data);
			// console.log('calculate finished, expression: %s', expression);
			// console.log('result: %f', eval(expression));
			replacePower(expression)
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
					throw "A01::mathService.checkBrackets: incorrect expression. excess closing bracket"
				}
			}
			if (counter != 0){
				throw "A01::mathService.checkBrackets: incorrect expression. excess opening bracket"
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
				var replaceThis = new RegExp('(?:\\+|\\-|\\/|\\*|\\(|\\^|^)('+ key +')(?:\\+|\\-|\\/|\\*|\\)|\\^|$)');
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

		var replacePower = function (expression){
			var template = expression.match("((?:\\(?[0-9]+[\\.]{0,1}(?:[0-9]*)\\)?|\\(?[a-zA-Z\\.]+\\)?)(\\^)(?:\\(?[0-9]+[\\.]{0,1}(?:[0-9]*)\\)?|\\(?[a-zA-Z\\.]+\\)?))");
			console.log('replacePower initial : %s; \nresult: ', expression, template)
			try{
				checkBrackets(template[0]);
			}
			catch(err){
				if(err == "A01::mathService.checkBrackets: incorrect expression. excess opening bracket"){
					var trimmed = removeOpenBracket(template[0]);
					var replacement = trimmed.split('^');
					expression = expression.substring(0, template.index) +
						"(Math.pow(" + replacement[0] + "," + replacement[1] + ")" +
						expression.substring(template.index + template[0].length);
				}
				if(err == "A01::mathService.checkBrackets: incorrect expression. excess closing bracket"){
					var trimmed = removeCloseBracket(template[0]);
					var replacement = trimmed.split('^');
					expression = expression.substring(0, template.index) +
						"Math.pow(" + replacement[0] + "," + replacement[1] + "))" +
						expression.substring(template.index + template[0].length);
				}
			}
			finally{
				if (template[0].indexOf('(') == 0 && template[0].indexOf(')') == template[0].length-1){
					var replacement = (template[0].substring(1, template[0].length-1)).split('^');
					console.log(replacement)
					expression = expression.substring(0, template.index) +
						"(Math.pow(" + replacement[0] + "," + replacement[1] + "))" +
						expression.substring(template.index + template[0].length);
				}
				console.log('after trim : %s', expression)
			}
		}

		var removeOpenBracket = function (expression){
			var openBracketPos = -1;
			var isClosed = true;
			for (var i = 0; i < expression.length; i++){
				if (expression[i] == '('){
					openBracketPos = i;
					isClosed = false;
				}
				if (expression[i] == ')'){
					isClosed = true;
				}
			}
			if (isClosed == false){
				expression = expression.substring(0, openBracketPos) + 
					expression.substring(openBracketPos + 1, expression.length);
				// console.log('trimmed (open removed): %s', expression)
			}
			return expression;
		}

		var removeCloseBracket = function (expression){
			var closeBracketPos = -1;
			var isOpen = false;
			for (var i = 0; i < expression.length; i++){
				if (expression[i] == '('){
					isOpen = true;
				}
				if (expression[i] == ')'){
					if (isOpen){
						isOpen = false;
					}
					else {
						closeBracketPos = i;
					}
				}
			}
			if (closeBracketPos != -1){
				expression = expression.substring(0, closeBracketPos) + 
					expression.substring(closeBracketPos + 1, expression.length);
				console.log('trimmed (close removed): %s', expression)
			}
			return expression;
		}

		var initCalculation = function (expression, data){
			var openBracketPos = 0;
			var isClosed = true;
			for (var i = 0; i < expression.length; i++){
				if (expression[i] == '('){
					openBracketPos = i;
					isClosed = false;
					continue;
				}
				if (expression[i] == ')' && !isClosed){
					console.log("inner part : %s", expression.substring(openBracketPos, i+1));
					var innerExpression = expression.substring(openBracketPos, i+1);
					if (innerExpression.indexOf('^') > -1){
						replacePower(innerExpression, data)
					}
					else{
						console.log('result: %s', eval(innerExpression))
					}
					isClosed = true;
					continue;
				}
			}
		}
	})

angular.module('app-output.controller', ['app-core'])
	.controller('ChartCtrl', ['$scope', '$controller', 'mathService', 
		function($scope, $controller, mathService){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}))

		$scope.trialModel = "ln(a^bcc*exp(c/d)+1/c-ln(c))";
		$scope.result = 123;
		$scope.ccc = 100;
		$scope.calculate = function (){
			var a = 14;
			var b = 17;
			var c = 1;
			var d = 2;
			// mathService.calculate( $scope.trialModel , {'a': a, 'b': b, 'c': c, 'd': d});
			mathService.calculate($scope.trialModel, {'a': a, 'bcc': b, 'c': c, 'd': d});
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
