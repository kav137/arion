/**
* app-ui Module
*
* This module allows u to control all ui settings
*/
angular.module('app-ui', ['app-core']).
	service('uiModalService', ['$rootScope', function($rootScope){
		var a = true;
	}]).
	service('uiResizeService', ['$rootScope', function($rootScope){
		function asd (argument) {
			// alert('asd')
			// console.log(angular.element("content"));
		}
		return {
			asd: asd
		}
	}]).
	// .directive('resizer', function($document) {
	// 	return function($scope, $element, $attrs) {

	// 		$element.on('mousedown', function(event) {
	// 			event.preventDefault();

	// 			$document.on('mousemove', mousemove);
	// 			$document.on('mouseup', mouseup);
	// 		});

	// 		function mousemove(event) {

	// 			if ($attrs.resizer == 'vertical') {
	// 				// Handle vertical resizer
	// 				var x = event.pageX;

	// 				if ($attrs.resizerMax && x > $attrs.resizerMax) {
	// 					x = parseInt($attrs.resizerMax);
	// 				}

	// 				$element.css({
	// 					left: x + 'px'
	// 				});

	// 				$($attrs.resizerLeft).css({
	// 					width: x + 'px'
	// 				});
	// 				$($attrs.resizerRight).css({
	// 					left: (x + parseInt($attrs.resizerWidth)) + 'px'
	// 				});

	// 			} else {
	// 				// Handle horizontal resizer
	// 				var currentPosition = $element[0].getBoundingClientRect();
	// 				var y = currentPosition.top - event.pageY;
	// 				console.log("cp t", currentPosition.top);
	// 				console.log("e y ", event.pageY);
	// 				console.log((document.querySelector($attrs.resizerTop)).style.height)
	// 				return;

	// 				// $element.css({
	// 				// 	bottom: y + 'px'
	// 				// });
	// 					// console.log($element)

	// 				angular.element(document.querySelector($attrs.resizerTop)).css({
	// 					// bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
	// 					height: y + 'px'
	// 				});
	// 				// angular.element(document.querySelector($attrs.resizerBottom)).css({
	// 				// 	height: y + 'px'
	// 				// });

	// 				// $($attrs.resizerTop).css({
	// 				// 	bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
	// 				// });
	// 				// $($attrs.resizerBottom).css({
	// 				// 	height: y + 'px'
	// 				// });
	// 			}
	// 		}

	// 		function mouseup() {
	// 			$document.unbind('mousemove', mousemove);
	// 			$document.unbind('mouseup', mouseup);
	// 		}
	// 	};
	// }).
	run(['$log', 'uiResizeService', function ($log, uiResizeService){
		$log.info("app-ui initialized successfully");
		uiResizeService.asd();
	}])