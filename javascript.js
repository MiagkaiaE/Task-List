(function () {
	//переменные, которые видны во всей области IIFE
	const taskInput = document.getElementById('taskInput'); //нашли элемент ввода
	const taskAdd = document.getElementById('taskAdd'); //нашли элемент кнопки Добавить задачу
	const taskList = document.getElementById('taskList'); //нашли элемент списка задач
	const containerTaskList = document.getElementById('containerTaskList');
	const dataToDay = document.getElementById('dataToDay');//нашли элемент для даты
	const modalWindow = document.getElementById('modalWindow'); //элемент для модального окна
	const currentDate = new Date(); //получили сегодняшнюю дату
	let currentDay = returnDayOfTheMonth(currentDate);//фиксируем день для setInterval
	let tasks = []; //массив под задачи

	//загружаем задачи, если они есть 
	try {
		//ожидаем или null, или строку с задачами
		const savedTasks = localStorage.getItem("tasks");
		if (savedTasks) {
			tasks = JSON.parse(savedTasks);
			renderTasks(); // отображаем сохраненные задачи
		}
	} catch (error) {
		console.log("Ошибка при загрузке задач", error.message);
		tasks = [];
	}

	// Функция рендеринга задач
	function renderTasks() {
		taskList.innerHTML = ''; // Очищаем текущий список
		tasks.forEach(task => {
			 const taskElement = createTask(task.text, task.done);
			 taskList.appendChild(taskElement);
		});
		if (tasks.length === 0) {
			showModal();
		}
	}
	
	// функция для показа модального окна пустого списка
	function showModal() {
		createModalWindow('Список дел пуст', 'Добавь задачу', () => {
			 taskInput.focus();
			 console.log("Фокус на поле ввода");
		});
  }

	// обработчики событий для модального окна
	// Закрытие по клику на фон
	modalWindow.addEventListener('click', (e) => {
		// если клик произошел по любому участку фона модального окна
		if (e.target === modalWindow) {
			modalWindow.classList.remove('show-modal'); // Скрываем окно
		}
	});
	
	// Закрытие по клавише Esc
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && modalWindow.classList.contains('show-modal')) {
			modalWindow.classList.remove('show-modal'); // Скрываем окно
		}
	});
	

	//функция создания модального окна
	function createModalWindow (text, textButton, onButtonClick) {
		const modalContent = document.createElement('div');
		modalContent.classList.add('modal-window-content');
		// очищаем
      modalWindow.innerHTML = '';
		// создаем элементы
		const textModalWindow = document.createElement('p');
		textModalWindow.textContent = text;
		const buttonModalWindow = document.createElement('button');
		buttonModalWindow.textContent = textButton;
		modalContent.append(textModalWindow, buttonModalWindow);
      modalWindow.appendChild(modalContent);
		modalWindow.classList.add('show-modal');

		// Обработчик для кнопки с анимацией
		buttonModalWindow.addEventListener('click', () => {
			modalWindow.style.opacity = '0'; // Начинаем анимацию исчезновения
			setTimeout(() => {
				 modalWindow.classList.remove('show-modal'); // Скрываем после анимации
				 if (onButtonClick && typeof onButtonClick === 'function') {
					  onButtonClick();
				 }
			}, 300); // Задержка соответствует длительности анимации
	  });
		
		console.log('модальное окно создано')
		return modalWindow
	}


	//определяем фон при загрузке страницы
	function defineBGColor(day) {
		containerTaskList.classList.remove('even-day');
		if (day % 2 === 0) {
			containerTaskList.classList.add('even-day');
		}
		console.log('фон определен')
	};
	defineBGColor(currentDay);

	//определяем дату при загрузке страницы
	// функция форматирования даты
	function formationDate(date) {
		const formatter = new Intl.DateTimeFormat({ dateStyle: 'short' });
		const formatDate = formatter.format(date);
		//создаем строку даты для листа задач
		const nowDate = `Дата: ${formatDate}`;
		console.log(nowDate);
		return nowDate;
	}
	//записываем дату в строку
	dataToDay.textContent = formationDate(currentDate);

	//функция, которая определяет день месяца
	function returnDayOfTheMonth(date) {
		// получаем день из даты
		const dayOfMonth = date.getDate();
		console.log(dayOfMonth);
		return dayOfMonth;
	}

	//функция для определения смены дня и фона
	function chooseBackgroundColor(day) {
		//получаем дату сейчас
		const nowData = new Date();
		//получаем число сейчас
		const nowDay = returnDayOfTheMonth(nowData);
		//спавниваем с сохраненным днем
		if (nowDay !== day) {
			//перезаписываем число дня в переменную
			currentDay = nowDay;
			//перезаписываем дату
			dataToDay.textContent = formationDate(nowData);
			//вызываем функцию определения фона в зависимости от четности
			defineBGColor(currentDay);
			console.log('сменились дата и фон')
		}
	}
	//динамическая смена фона
	setInterval(() =>chooseBackgroundColor(currentDay), 60000);

	
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

	//функция для создания задачи с обработчиками событий
	function createTask(taskText, done = false) {
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
		newTaskCheck.checked = done;
		const newTaskButton = document.createElement('button');
		//кнопка удалить задачу
		newTaskButton.textContent = 'Удалить задачу';

		// Применяем класс task-done, если задача выполнена
		if (done) {
			newTaskText.classList.add('task-done');
	  }

		//добавляю тект, кнопку и чекбокс в div-коробку задачи
		newTask.append(newTaskCheck, newTaskText, newTaskButton);
		//проверка, что задача добавлена в див
		console.log('Задача добавлена в div');

		// Простой обработчик для чекбокса
		newTaskCheck.addEventListener('change', () => {
			for (let i = 0; i < tasks.length; i++) {
				 if (tasks[i].text === taskText) {
					  tasks[i].done = newTaskCheck.checked;
					 localStorage.setItem("tasks", JSON.stringify(tasks));
					 // Добавляем или убираем класс task-done в зависимости от состояния чекбокса
                if (newTaskCheck.checked) {
						newTaskText.classList.add('task-done');
				  } else {
						newTaskText.classList.remove('task-done');
				  }
				  console.log("Статус задачи обновлён");
					  console.log("Статус задачи обновлён");
					  break;
				 }
			}
	  });

	  // Простой обработчик для кнопки удаления
	  newTaskButton.addEventListener('click', () => {
			for (let i = 0; i < tasks.length; i++) {
				 if (tasks[i].text === taskText) {
					  tasks.splice(i, 1);
					  localStorage.setItem("tasks", JSON.stringify(tasks));
					  newTask.remove();
					  console.log('Задача удалена');
					  if (tasks.length === 0) {
						  showModal();
					  }
					  break;
				 }
			}
	  });
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
			//добавляем задачу в локал
			tasks.push({ text: taskText, done: false });
			localStorage.setItem("tasks", JSON.stringify(tasks));
			console.log('задача добавлена в localStorage');
			//вызываем функцию, которая создает элементы задачи
			const newTask = createTask(taskText, false);
			//вызываем функцию, которая добавлят задачу в лист задач и очищает поле ввода
			addTaskToList(newTask, taskInput);
		}

	});

	// добавить задачу по Enter
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			const taskText = inputValidation(taskInput);

		if (taskText) {
			console.log('Кнопка нажата.Добавляем задачу')
			//добавляем задачу в локал
			tasks.push({ text: taskText, done: false });
			localStorage.setItem("tasks", JSON.stringify(tasks));
			console.log('задача добавлена в localStorage');
			//вызываем функцию, которая создает элементы задачи
			const newTask = createTask(taskText, false);
			//вызываем функцию, которая добавлят задачу в лист задач и очищает поле ввода
			addTaskToList(newTask, taskInput);
		}
		}
	});

})();