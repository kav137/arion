/**
* app-i18n Module
*
* Description
*/
angular.module('app-i18n', ['pascalprecht.translate'])
	.config(['$translateProvider', function($translateProvider) {
		$translateProvider.translations('ru', {
			'Add element': "Добавить элемент",
			'Add module': "Добавить модуль",
			'Add': "Добавить",
			'addElementModal' : 'Добавить элемент',
			'addModuleModal': 'Добавить модуль',
			'Arion': "АРИОН",
			'Assessment method': "Методика расчета",
			'Build report': "Составить отчет",
			'Calculate device': "Рассчитать устройство",
			'Calculate': "Рассчитать",
			'Coefficient': "Коэффициент",
			'Coefficients': "Значение коэффициентов, учитывающихся при расчете: ",
			'Element class': "Класс компонентов",
			'Element group': "Группа компонентов",
			'Element name': "Название элемента",
			'Element position': "Позиционное обозначение",
			'Element properties': "Характеристики элемента",
			'Fill the inputs': "Необходимо заполнить все поля",
			'Log in': "Войти",
			'Logout': "Выйти",
			'Model': "Модель расчета",
			'Module reliability': "Результат расчета по выбранному модулю : ",
			'Nested elements quantity': "Количество элементов, входящих в модуль : ",
			'Nothing found': "По вашему запросу не найдено ни одного элемента",
			'Optional': "Заполнение необязательно",
			'Password': "Пароль",
			'Reliability': "Результат расчета: ",
			'Remove': "Удалить",
			'Save': "Сохранить",
			'Search element': "Поиск элемента",
			'Search': "Поиск",
			'searchElementModal': "Поиск элемента",
			'Settings': "Настройки",
			'Show as list': "Отображать в виде списка элементов",
			'Show hidden properties': "Отображать скрытые свойства",
			'Sorting and filtering': "Cортировка и фильтрация",
			'Test charts': "Тест графиков",
			'Too much elements found': "По вашему запросу найдено более одного элемента. Уточните, пожалуйста, данные поиска",
			'Unnamed': "Безымянный",
			'Username': "Имя пользователя",
			'Welcome': "Добро пожаловать",

			//e ~ errors
			//e.whereHappened.reason
			"e.Node.abstractMethodCall": "Abstract method not implemented",
			"e.Element.undefinedGroup": "Undefined group/owner/subGroup"
		})
		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('escape');
	}])