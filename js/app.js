google.load('visualization', '1', {
	packages: ['corechart']
});

google.setOnLoadCallback(function() {
	console.log("Charts initialized successfully")
	console.log("Starting the app...")
	angular.bootstrap(document.body, ['app']);
})

/**
* app Module
*
* aggregator for all the modules
*/
angular.module('app', ['ngRoute', 'pascalprecht.translate', 'app-core', 'app-editor', 'app-output', 'app-i18n', 'app-header'])
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

	.config(['$translateProvider', function($translateProvider) {
		
	}])


/*
Charts initialization
 */
// var initGoogle = function () {
// 	try{
// 		google.load('visualization', '1', {
// 			packages: ['corechart']
// 		});

// 		google.setOnLoadCallback(function() {
// 			console.log("Charts initialized successfully")
// 			console.log("Starting the app...")
// 			angular.bootstrap(document.body, ['app']);
// 		})
// 	}
// 	catch(ex){
// 		alert('something went wrong during charts initialization. charts unavailable');
// 		angular.bootstrap(document.body, ['app']);
// 	}
// }

// initGoogle();