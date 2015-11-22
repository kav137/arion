/**
* app-ui Module
*
* This module allows u to control all ui settings
*/
angular.module('app-ui', ['app-core']).
	service('uiModalService', ['$rootScope', function($rootScope){
		
	}]).
	service('uiPanelsService', ['$rootScope', function($rootScope){
		var panels = {
			header:{
				visible: true,
				width: 
			},
			treePanel: {
				visible: true,
				width: 
			},
			editorPanel: {
				visible: true,
				width: 
			},
			outputPanel: {
				visible: true,
				width: 
			}
		}
	}])