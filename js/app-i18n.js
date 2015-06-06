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
			'Show as list': "Отображать в виде списка элементов",
			'Optional': "Заполнение необязательно",
			'Model': "Модель расчета",
			"Calculate": "Рассчитать",
			"Show hidden properties": "Отображать скрытые свойства",
			"Reliability": "Результат расчета: ",
			"Coefficients": "Значение коэффициентов, учитывающихся при расчете: ",
			"Coefficient": "Коэффициент",
			"Welcome": "Добро пожаловать",
			"Log in": "Войти",
			"Username": "Имя пользователя",
			"Password": "Пароль",


			'addElementModal' : 'Добавить элемент',
			'addModuleModal': 'Добавить модуль'
		})
		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('escape');
	}])