/**
* app Module
*
* aggregator for all the modules
*/
angular.module('app', ['ngRoute', 'pascalprecht.translate', 'app-core', 'app-editor', 'app-output'])
	.run(['$log', '$rootScope', function ($log, $rootScope){
		$log.info('application initialized successfully');
		$rootScope.$broadcast('appInitialized')
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