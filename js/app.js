var app = angular.module('app', ['ngRoute', 'app-tree']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/',
	{
		templateUrl : "templates/mainView.html",
		controller: 'displayCtrl'
	})
	.otherwise({
		redirectTo: '/'
	})
}]);

app.controller('displayCtrl', ['$scope', function($scope){
	$scope.test = "adasdsd"
	
}]);

