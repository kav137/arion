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
			'Save': "Сохранить",
			'Settings': "Настройки",
			'Calculate device': "Рассчитать устройство",
			'Build report': "Составить отчет",
			'Logout': "Выйти",
			'Class': "Класс"
		})
		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('escape');
	}])