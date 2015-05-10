/**
* app Module
*
* aggregator for all the modules
*/
angular.module('app', ['ngRoute', 'app-core', 'app-editor'])
	.run(['$log', function ($log){
		$log.info('application initialized successfully')
		
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