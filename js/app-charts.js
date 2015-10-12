/**
* app-charts.services Module
*
* Description
*/
angular.module('app-charts', ['app-core'])

	.run(['$log', function($log){
		$log.info("app-charts initialized successfully");
	}])

	.service('chartsContentManager', ['$scope', function(){
		
	}])

	.directive('lambdaChart', ['$rootScope', function($rootScope){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				var chart = new google.visualization.LineChart(iElm[0]);
				// console.log(iElm);
				// console.log(document.getElementByI('asdasd'))
				var data = google.visualization.arrayToDataTable([
			        ['Year', 'Sales', 'Expenses'],
			        ['2009', 1000, 400],
			        ['2010', 1170, 460],
			        ['2011', 660, 1120],
			        ['2012', 1030, 5400]
		      	]);
		      	var options = {
			        title: 'ASDASDad'
		      	};
		      	// iElm.text("hhhhh")
		      	chart.draw(data, options);

		      	$rootScope.$on('ttt',function(event, args){
		      	  alert('yeap')
		      	});
			}
		};
	}]);

