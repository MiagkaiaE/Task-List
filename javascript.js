(function () {
	//переменные, которые видны во всей области IIFE
	const taskInput = document.getElementById('taskInput'); //нашли элемент ввода
	const taskAdd = document.getElementById('taskAdd'); //нашли элемент кнопки Добавить задачу
	const taskList = document.getElementById('taskList'); //нашли элемент списка задач

	//функция для проверки ввода
	function inputValidation(input) {
		//получаем строку из ввода
		const taskText = input.value.trim();
		//сбрасываем подсветку на случай, если она горит 
		input.classList.remove('empty-input');
		//проверяем строку
		if (taskText === '') {
			input.classList.add('empty-input');// если пустая, подключаем класс empty-input
			console.log('пусто'); //выводим пусто в консоль
			// добавляем отложенную отмену класса подсветки
			setTimeout(function () {
				//сбрасываем класс
				input.classList.remove('empty-input');
				// проверка, что класс сброшен
				console.log('Подсветка сброшена через 1.5 секунды');
		  }, 1500); // 3000 миллисекунд = 3 секунды
			return false; // функуция возвращает false
		} else {
			console.log('функция вернула текс задачи')
			return taskText; //если не пустая, функция возвращает переменную taskText
		}
	};

	//функция для обработчика чекбокс
	function handleCheckboxChange(checkbox, text) {
		if (checkbox.checked) {
			//добавляем класс к тексту задачи
			text.classList.add('task-done');
			console.log("задача выполнена"); //проверка
		} else {
			//если галочка снята, удаляем класс с текста задачи
			text.classList.remove('task-done');
			console.log('Галочка снята'); //проверка
		}
	};

	//функция для обработчика кнопки Удалить задачу
	function handleDeleteClick(task) {
		//если кнопка нажата, удаляем весь div c задачей
		task.remove();
		//проверка
		console.log('задача удалена')
	};

	//функция для создания задачи с обработчиками событий
	function createTask(taskText) {
		//создаем div коробку для задачи
		const newTask = document.createElement('div');
		//добавляем к нему класс для дальнейшей стилизации
		newTask.classList.add('style-task');
		// создаем параграф для текста задачи
		const newTaskText = document.createElement('p')
		// добавляем туда текст равной значению переменной taskText
		newTaskText.textContent = taskText;
		// создаю чек бокс для задачи
		const newTaskCheck = document.createElement('input');//поле input
		newTaskCheck.type = 'checkbox';//определяю тип поля checkbox
		const newTaskButton = document.createElement('button');
		//кнопка удалить задачу
		newTaskButton.textContent = 'Удалить задачу';

		//добавляю тект, кнопку и чекбокс в div-коробку задачи
		newTask.append(newTaskCheck, newTaskText, newTaskButton);
		//проверка, что задача добавлена в див
		console.log('Задача добавлена в div');

		//обработчик событий для чекбокса
		newTaskCheck.addEventListener('change', () => handleCheckboxChange(newTaskCheck, newTaskText));

		//обработчик событий для кнопки удалить задачу
		newTaskButton.addEventListener('click', () => handleDeleteClick(newTask));
	return newTask
	};

	//функция для добавления задачи в лист задач
	function addTaskToList(task, input) {
		//добавляем задачу в лист задач
		taskList.append(task);
		// проверка задача добавлена на страницу
		console.log('Задача добавлена на страницу');
		// очищаем поле ввода для новой задачи
		input.value = '';
		//проверка очистки поля
		console.log('поле очищено');
		
	};

	taskAdd.addEventListener('click', function () {
		//вызываем функцию для проверки ввода
		// результат функции записываем в переменную taskText
		const taskText = inputValidation(taskInput);

		if (taskText) {
			console.log('Кнопка нажата.Добавляем задачу')
			//вызываем функцию, которая создает элементы задачи
			//функция возвращает div коробку задачи с элементами внутри,записываем div в переменную newTask
			const newTask = createTask(taskText);
			//вызываем функцию, которая добавлят задачу в лист задач и очищает поле ввода
			addTaskToList(newTask, taskInput);
		}

	});
})();