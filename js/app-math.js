
angular.module('app-math', ['app-core'])
	.service('mathService', function(){
		var MS = this;

		this.calculate = function (expression, data){
			// // console.clear();
			// // console.log('calculate starts, input expression : %s', expression);
			checkSafety(expression);
			checkBrackets(expression);
			expression = replaceCommas(expression)
			expression = replaceOperations(expression);
			expression = replaceVariables(expression, data);
			// // console.log("START CALCULATION")
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
			// // console.log('checkBrackets success')
		}

		var checkSafety = function (expression){
			var reservedWords = ['=', ' ', ';', 'break', 'case', 'constructor', 'delete', 'do', 'else', 'eval', 'finally', 'for',
				'function', 'goto', 'if', 'return', 'prototype', 'try', 'var', 'while'];
			angular.forEach(reservedWords, function (word){
				if(expression.indexOf(word) != -1){
					throw "A01::mathService.checkSafety: unsafe expression to be evaluated"
				}
			})
			// // console.log('checkSafety success')
		}

		var replaceCommas = function (expression){
			while (expression.indexOf(',') > -1){
				expression = expression.replace(',', '.');
			}
			// // console.log('replaceCommas success. out expression: %s', expression);
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
			// // console.log('replaceVariables success. out expression: %s', expression);
			return expression;
		}

		var replaceOperations = function (expression) {
			expression = replaceLn(expression);
			expression = replaceExp(expression);
			// // console.log('replaceOperations success. out expression: %s', expression);
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
			// // console.log("innerExpression : %s", expression)
			while(expression.indexOf('^') != -1){
				var template = expression.match("((?:\\(?-?([0-9]+([\.][0-9]+)?e\-?[0-9]+)\\)?|\\(?-?[0-9]+[\\.]{0,1}(?:[0-9]*)\\)?|\\(?-?[a-zA-Z\\.]+\\)?)(\\^)(?:\\(?-?([0-9]+([\.][0-9]+)?e\-?[0-9]+)\\)?|\\(?-?[0-9]+[\\.]{0,1}(?:[0-9]*)\\)?|\\(?-?[a-zA-Z\\.]+\\)?))");
				// // console.log('replacePower match result : ', template)
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
						// // console.log('power execution result: %s', expression);
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
						// // console.log('power execution result: %s', expression);
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
				// // console.log('power execution result: %s', expression)
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
				// // console.log('trimmed (close removed): %s', expression)
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
						// // console.log("####################")
						// // console.log('init expression: %s', expression)
						var innerExpression = expression.substring(openBracketPos, i+1);
						// // console.log("inner part : %s", innerExpression);
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
						// // console.log('result: %s', temp)
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
					// // console.log('final result: %f', res)
					return res;
				}
			}
		}
	})
	.service('calculateService', ['mathService', function (mathService){
		this.initKeys = function(element){
			var array = element.properties;
			return getValues(array);
		}

		//output [{"key" : "A", value: 123}, ...]
		var getValues = (array) => {
			return _.flattenDeep(array.reduce((acc, p) => {
				return acc.concat(getPropertyValue(p));
			}, []));
		}

		var getPropertyValue = (p) => {
			if (p.Type === undefined || p.Type == 1 || p.Type == 2){ //non-strict equality caused by type differences
				/*debug*/ if (!p.Key || p.value === undefined) throw `getPropertyValue error : ${p}`;
				return getSimplePropertyValue(p);
			}
			if (p.Type == 4){
				return getComplexPropertyValue(p);
			}
		}

		var getSimplePropertyValue = (p) => {
			return {
				"key" : p.Key,
				"value" : stringToNumber(p.value)
			};
		}

		var getComplexPropertyValue = (p) => {
			if (p.value.Property && angular.isArray(p.value.Property)){
				if(p.value.Property.length === 1){
					return getPropertyValue(p.value.Property[0]);	
				}
				else {
					throw `initComplexProperty :: property.value.Property.length !== 1. Name : ${p.value.Name}`;
				}
			}
			if (p.value.Key && angular.isArray(p.value.Key)){
				console.log(p.Name);
				return p.value.Key.map(getPropertyValue);
			}
		}

		var stringToNumber = (str) => {
			var ret = parseFloat(str.replace(',', '.'));
			/*debug*/ Number.isFinite(ret)? 0 : console.error(`stringToNumber :: wrong result : ${ret}`);
			return ret;
		}

		// var getValues = function (array){
		// 	var keys = [];
		// 	angular.forEach(array, function (item){
		// 		//handling number inputs
		// 		if (item.Type == 2 || item.Type == 1){
		// 			var obj = {};
		// 			obj.key = item.Key;
		// 			obj.value = parseFloat(item.value.replace(',', '.'))
		// 			keys.push(obj)
		// 		}
		// 		//handling drop down lists
		// 		if (item.Type == 4){
		// 			//handling nested dependent properties
		// 			angular.forEach(item.value.Property, function (innerProperty){
		// 				var obj = {};
		// 				obj.key = innerProperty.Key;
		// 				if(innerProperty.value != undefined){
		// 					if ((typeof innerProperty.value) == "string"){
		// 						obj.value = parseFloat((innerProperty.value).replace(',', '.'));
		// 					}
		// 					else{
		// 						obj.value = parseFloat(innerProperty.value);
		// 					}
		// 				}
		// 				else{
		// 					if ((typeof innerProperty.Default) == "string"){
		// 						obj.value = parseFloat((innerProperty.Default).replace(',', '.'));
		// 					}
		// 					else{
		// 						obj.value = parseFloat(innerProperty.Default);
		// 					}
		// 				}
		// 				keys.push(obj)
		// 			});
		// 			//handling nested non-editable keys
		// 			angular.forEach(item.value.Key, function (innerKey){
		// 				//handling case when there are no more nested levels
		// 				if (innerKey.Key){
		// 					var obj = {};
		// 					obj.key = innerKey.Key;
		// 					if(innerKey.value != undefined){
		// 						if ((typeof innerKey.value) == "string"){
		// 							obj.value = parseFloat((innerKey.value).replace(',', '.'))
		// 						}
		// 						else{
		// 							obj.value = parseFloat((innerKey.value))
		// 						}
		// 					}
		// 					else{
		// 						if ((typeof innerKey.Default) == "string"){
		// 							obj.value = parseFloat((innerKey.Default).replace(',', '.'))
		// 						}
		// 						else{
		// 							obj.value = parseFloat((innerKey.Default))
		// 						}
		// 					}
		// 					keys.push(obj);
		// 					return;
		// 				}
		// 				else{
		// 					// debugger;
		// 					// console.log(getValues(innerKeykey));
		// 				}
		// 			})
		// 		}
		// 	});
		// 	return keys;
		// }

		this.calculateCoefficients = function (element, keysArray){
			var varObj = {};
			angular.forEach(element.coefficients, function (coef){
				angular.forEach(keysArray, function (item){
					varObj[item.key] = item.value;
				})
				coef.value = mathService.calculate(coef.Default, varObj)
			})
			return varObj;
		}
		
		this.extendVarObjWithCoefs = function (element, varObj){
			angular.forEach(element.coefficients, function (item){
				varObj[item.Key] = item.value;
			})
			return varObj;
		}	

		this.calculateModel = function (element, varObj){
			element.modelValue = mathService.calculate(element.method, varObj);
			// $scope.coefficients = varObj;
		}
	}])
	.run(['$log' , function($log){
		$log.info('app-math initialized successfully');
	}])
 

