/**
* app-i18n Module
*
* Description
*/
angular.module('app-i18n', ['pascalprecht.translate'])
	.config(['$translateProvider', function($translateProvider) {
		$translateProvider.translations('ru', {
			'Arion': "АРИОН",
			'Add element': "Добавить элемент",
			'Add module': "Добавить модуль",
			'Add': "Добавить",
			'Save': "Сохранить",
			'Settings': "Настройки",
			'Calculate device': "Рассчитать устройство",
			'Build report': "Составить отчет",
			'Logout': "Выйти",
			'Element class': "Класс компонентов",
			'Element group': "Группа компонентов",
			'Assessment method': "Методика расчета",
			'Element position': "Позиционное обозначение",


			'addElementModal' : 'Добавить элемент'
		})
		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('escape');
	}])