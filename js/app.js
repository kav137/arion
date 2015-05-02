/**
* app Module
*
* aggregator for all the modules
*/
angular.module('app', ['ngRoute', 'app-tree'])
	.run(['$log', function ($log){
		$log.info('app module is initialized')
		
	}])

	.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/',
	{
		templateUrl : "templates/mainView.html"
	})
	.otherwise({
		redirectTo: '/'
	})
}])