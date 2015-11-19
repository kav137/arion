/**
* app-utils Module
*
* Description
*/
angular.module('app-utils', ['app-core'])
	.filter('exponential', function (){
		return function (input){
			return input.toExponential(3)
		}
	})