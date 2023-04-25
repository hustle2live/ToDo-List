const toDelete = 'delete';
const toDo = 'todo';

const inputElement = document.querySelector('.input-1'),
   taskOrderedList = document.querySelector('.tasklist'),
   errorMessageElement = document.querySelector('.alertMessage'),
   addNewTaskButton = document.querySelector('.button-primary'),
   clearAllButton = document.querySelector('.button-secondary');

const getInputData = () => inputElement.value.trim();

const getDataFromLocalStorage = () => (taskBox = JSON.parse(localStorage.getItem('taskBox')) || []);

const writeToLocalStorage = (taskBox = []) => localStorage.setItem('taskBox', JSON.stringify(taskBox));

const addNewTask = () => {
   if (getInputData().length === 0) {
      errorMessageElement.textContent = 'Error: not enough length. Please, input some text.';
      return false;
   }

   errorMessageElement.textContent = '';
   const newTask = {
      name: '',
      isComplete: false
   };

   newTask.name = getInputData();
   getDataFromLocalStorage();

   taskBox.push(newTask);
   writeToLocalStorage(taskBox);
   inputElement.value = '';

   render();
};

const clearAll = () => {
   writeToLocalStorage();
   taskOrderedList.innerHTML = '';
   getStatistics();
};

const createElement = (elementTag, className, innerHTML = '') => {
   const newElement = document.createElement(elementTag);
   newElement.classList.add(className);
   newElement.innerHTML = innerHTML;
   return newElement;
};

const getCompletedItems = (array) => array.filter(({ isComplete }) => isComplete).length;

const render = () => {
   taskOrderedList.innerHTML = '';
   getDataFromLocalStorage();

   for (const key in taskBox) {
      const listElement = createElement('li', 'item', `<span>${taskBox[key].name} </span>`);
      const listElementButtons = createElement('div', 'item-buttons', '');

      const toDoButton = createElement(
         'button',
         'todo-button',
         `<span class="material-icons-outlined md-18">check</span>`
      );
      const toDelButton = createElement('button', 'delete-button', `<span class="material-icons md-18">clear</span>`);
      const markAsCompleted = createElement(
         'div',
         'icon_ready',
         `<span class="material-icons-outlined md-18">done_all</span>`
      );

      toDoButton.addEventListener('click', () => taskManagement(toDo, taskBox[key].name));
      toDelButton.addEventListener('click', () => taskManagement(toDelete, taskBox[key].name));

      if (taskBox[key].isComplete) {
         listElement.classList.add('completed');
         listElementButtons.append(markAsCompleted, toDelButton);
      } else {
         listElementButtons.append(toDoButton, toDelButton);
      }

      listElement.appendChild(listElementButtons);
      taskOrderedList.appendChild(listElement);
   }

   writeToLocalStorage(taskBox);
   getStatistics();
};

const getStatistics = () => {
   document.querySelector('.stats__total').innerHTML = getDataFromLocalStorage().length;
   document.querySelector('.stats__completed').innerHTML = getCompletedItems(taskBox);
};

const taskManagement = (action, itemName) => {
   if (action === toDo) {
      for (const key in taskBox) {
         if (taskBox[key].name === itemName) {
            taskBox[key].isComplete = true;
            taskBox.push(taskBox[key]);
            taskBox.splice([key], 1);
            writeToLocalStorage(taskBox);
         }
      }
   }

   if (action === toDelete) {
      for (const key in taskBox) {
         if (taskBox[key].name === itemName) {
            taskBox.splice([key], 1);
            writeToLocalStorage(taskBox);
         }
      }
   }
   return render();
};

render();

addNewTaskButton.addEventListener('click', addNewTask);
clearAllButton.addEventListener('click', clearAll);

console.log(taskBox);
