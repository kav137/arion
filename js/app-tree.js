/**
* app-tree Module
*
* provides logic for tree building
*/
angular.module('app-tree', ['ngRoute'])

.controller('TreeCtrl', ['', function($scope){
	$scope.tree = [
		'first', 'second', 'last'
	]
}]);