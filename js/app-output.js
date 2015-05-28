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
			console.log("START CALCULATION")
			var result = initCalculation(expression, data);
			return result;
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

		var replacePower = function (expression, data){
			while(expression.indexOf('^') != -1){
				var template = expression.match("((?:\\(?-?[0-9]+[\\.]{0,1}(?:[0-9]*)\\)?|\\(?-?[a-zA-Z\\.]+\\)?)(\\^)(?:\\(?-?[0-9]+[\\.]{0,1}(?:[0-9]*)\\)?|\\(?-?[a-zA-Z\\.]+\\)?))");
				console.log('replacePower match result : ', template)
				try{
					checkBrackets(template[0]);
				}
				catch(err){
					//handling '(xxx^xxx' case
					if(err == "A01::mathService.checkBrackets: incorrect expression. excess opening bracket"){
						var trimmed = removeOpenBracket(template[0]);
						var replacement = trimmed.split('^');
						var powerStr = "Math.pow(" + replacement[0] + "," + replacement[1] + ")";
						var result = eval(powerStr);
						expression = expression.substring(0, template.index) +
							"(" + result +
							expression.substring(template.index + template[0].length);
						console.log('power execution result: %s', expression);
						continue;
					}
					//handling 'xxx^xxx)' case
					if(err == "A01::mathService.checkBrackets: incorrect expression. excess closing bracket"){
						var trimmed = removeCloseBracket(template[0]);
						var replacement = trimmed.split('^');
						var powerStr = "Math.pow(" + replacement[0] + "," + replacement[1] + ")";
						var result = eval(powerStr);
						expression = expression.substring(0, template.index) +
							result + ")" +
							expression.substring(template.index + template[0].length);
						console.log('power execution result: %s', expression);
						continue;
					}
				}
				//handling '(xxxx^xxxx)' case
				if (template[0].indexOf('(') == 0 && template[0].indexOf(')') == template[0].length-1
					&& template[0].indexOf('(', 1) == -1){
					var replacement = (template[0].substring(1, template[0].length-1)).split('^');
				}
				//handling 'xxxx^xxxx' case
				else{
					var replacement = template[0].split('^');
				}
				var powerStr = "Math.pow(" + replacement[0] + "," + replacement[1] + ")";
				var result = eval(powerStr);
				expression = expression.substring(0, template.index) +
					"(" + result + ")" +
					expression.substring(template.index + template[0].length);
				console.log('power execution result: %s', expression)
			}
			return expression;
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
			var lnPre = false;
			var expPre = false;
			for (var i = 0; i < expression.length; i++){
				//if there are brackets to get in
				if (expression.indexOf('(') > -1){
					if (expression[i] == '('){
						openBracketPos = i;
						isClosed = false;
						continue;
					}
					//handle the most nested expression
					if (expression[i] == ')' && !isClosed){
						console.log("####################")
						console.log('init expression: %s', expression)
						var innerExpression = expression.substring(openBracketPos, i+1);
						console.log("inner part : %s", innerExpression);
						if (i > 2 && expression.substring(0, openBracketPos).lastIndexOf('log') != -1 &&
								expression.substring(0, openBracketPos).lastIndexOf('log') == 
								expression.substring(0, openBracketPos).length-3 ){
							lnPre = true;
						}
						if (i > 2 && expression.substring(0, openBracketPos).lastIndexOf('exp') != -1 &&
								expression.substring(0, openBracketPos).lastIndexOf('exp') == 
								expression.substring(0, openBracketPos).length-3){
							expPre = true;
						}
						if (innerExpression.indexOf('^') > -1){
							innerExpression = replacePower(innerExpression, data);
						}
						if(lnPre){
							innerExpression = "Math.log(" + innerExpression + ")";
							var replacement = eval(innerExpression);
							var temp = expression.substring(0, openBracketPos-8) 
										+ replacement 
										+ expression.substring(i+1);
						}
						if(expPre){
							innerExpression = "Math.exp(" + innerExpression + ")";
							var replacement = eval(innerExpression);
							var temp = expression.substring(0, openBracketPos-8) 
										+ replacement 
										+ expression.substring(i+1);
						}
						if(!expPre && !lnPre){
							var replacement = eval(innerExpression);
							var temp = expression.substring(0, openBracketPos) 
										+ replacement 
										+ expression.substring(i+1);
						}
						console.log('result: %s', temp)
						expression = temp;
						if (Number.parseFloat(expression) !== NaN)
							i = -1;
						isClosed = true;
						lnPre = false
						expPre = false;
					}
				}
				else{
					if(expression.indexOf('^') > -1){
						expression = replacePower(expression, data);
					}
					var res = eval(expression)
					console.log('final result: %s', res)
					return res;
				}
			}
		}
	})

angular.module('app-output.controller', ['app-core'])
	.controller('ChartCtrl', ['$scope', '$controller', 'mathService', 
		function($scope, $controller, mathService){
		angular.extend(this, $controller('RootCtrl', {$scope: $scope}))

		$scope.trialModel = "ln(a^bcc*exp(c/d)+1/c-ln(c))";
		$scope.result;
		$scope.ccc = 100;
		$scope.calculate = function (){
			var a = 1;
			var b = 2;
			var c = 3;
			var d = 4;
			$scope.result = mathService.calculate($scope.trialModel, {'a': a, 'b': b, 'c': c, 'd': d, 'bcc': 5});
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
