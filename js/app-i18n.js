/**
* app-i18n Module
*
* Description
*/
angular.module('app-i18n', ['pascalprecht.translate'])
	.config(['$translateProvider', function($translateProvider) {
		$translateProvider.translations('ru', {
			'Arion': "АРИОН",
			'Add element': "Элемент",
			'Add module': "Модуль",
			'Add': "Добавить",
			'Add to element': "Неовзможно добавить новый компонент к узлу-элементу. Выберите модуль, пожалуйста",
			'Add to close module': "Элемент добавлен. Разверните выпадающий список для отображения дочерних узлов",
			'Save': "Сохранить",
			'Parameters required': "Необходимо заполнить все требуемые поля",
			'Remove node': "Удалить узел",
			'Remove device': "Невозможно удалить устройство",
			'Remove element?': "Вы уверены, что хотите удалить элемент?",
			'Remove module?': "Модуль может содержать дочерние элементы. Вы уверены, что хотите удалить модуль?",
			'Search': "Поиск",
			'Settings': "Настройки",
			'Calculate device': "Рассчитать устройство",
			'Build report': "Составить отчет",
			'Define initial parameters': "Необходимо определить класс, группу и метод расчета элемента",
			'Logout': "Выйти",
			'Element class': "Класс компонентов",
			'Element group': "Группа компонентов",
			'Assessment method': "Методика расчета",
			'Element position': "Позиционное обозначение",
			'Element name': "Название элемента",
			'Element properties': "Характеристики элемента",
			'Show as list': "Отображать в виде списка элементов",
			'Optional': "Заполнение необязательно",
			'Model': "Модель расчета",
			"Calculate": "Рассчитать",
			"Show hidden properties": "Отображать скрытые свойства",
			"Reliability": "Результат расчета: ",
			'Test charts': "Тест графиков",
			'Module reliability': "Результат расчета по выбранному модулю : ",
			"Nested elements quantity": "Количество элементов, входящих в модуль : ",
			"Coefficients": "Значение коэффициентов, учитывающихся при расчете: ",
			"Coefficient": "Коэффициент",
			"Welcome": "Добро пожаловать",
			"Log in": "Войти",
			"Username": "Имя пользователя",
			"Password": "Пароль",
			"Search element": "Поиск элемента",
			"Sorting and filtering": "Cортировка и фильтрация",
			"Switch charts": "Переключить график",
			"Subgroups unavailable": "Для выбранных параметров отстутсвуют группы компонентов",
			'Nothing found': "По вашему запросу не найдено ни одного элемента",
			'Too much elements found': "По вашему запросу найдено более одного элемента. Уточните, пожалуйста, данные поиска",


			"searchElementModal": "Поиск элемента",
			'addElementModal' : 'Добавить элемент',
			'addModuleModal': 'Добавить модуль'
		})
		$translateProvider.preferredLanguage('ru');
		$translateProvider.useSanitizeValueStrategy('escape');
	}])