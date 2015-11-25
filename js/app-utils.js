/**
* app-utils Module
*
* Description
*/
angular.module('app-utils', ['app-core'])
	.filter('exponential', function (){
		return function (input){
			return angular.isNumber(input)? input.toExponential(3) : (0).toExponential(3);
		}
	})