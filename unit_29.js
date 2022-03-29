const inputElement = document.querySelector(".input-1"),
  taskListElement = document.querySelector(".tasklist"),
  errorMessageElement = document.querySelector(".alertMessage"),
  addNewTaskButton = document.querySelector(".button-primary"),
  clearAllButton = document.querySelector(".button-secondary");

const getInputData = () => inputElement.value.trim();

const getDataFromLocalStorage = () =>
  (taskBox = JSON.parse(localStorage.getItem("taskBox")) || []);

const writeToLocalStorage = (taskBox = []) =>
  localStorage.setItem("taskBox", JSON.stringify(taskBox));

const addNewTask = () => {
  if (getInputData().length === 0) {
    errorMessageElement.textContent =
      "Error: not enough length. Please, input some text.";
    return false;
  }
  errorMessageElement.textContent = "";
  const newTask = {
    name: "",
    isComplete: false
  };
  newTask.name = getInputData();
  getDataFromLocalStorage();
  taskBox.push(newTask);
  writeToLocalStorage(taskBox);
  inputElement.value = "";
  fillTheList();
};

const clearAll = () => {
  writeToLocalStorage();
  taskListElement.innerHTML = "";
  getStatistics();
};

const createElement = (elementTag, className, innerHTML = "") => {
  const newElement = document.createElement(elementTag);
  newElement.classList.add(className);
  newElement.innerHTML = innerHTML;
  return newElement;
};

const getCompletedItems = (array) =>
  array.filter(({ isComplete }) => isComplete).length;

const fillTheList = () => {
  taskListElement.innerHTML = "";
  getDataFromLocalStorage();

  for (const key in taskBox) {
    const toDoButton = createElement(
      "div",
      "todo-button",
      `<div class="material-icons-outlined md-18">check</div>`
    );
    const toDelButton = createElement(
      "div",
      "delete-button",
      `<div class="material-icons md-18">clear</div>`
    );
    const markReady = createElement(
      "div",
      "icon_ready",
      `<div class="material-icons-outlined md-18">done_all</div>`
    );
    const itemDiv = createElement(
      "li",
      "item",
      `<span>${taskBox[key].name} </span>`
    );
    const itemDivButtons = createElement("div", "item-buttons", "");
    itemDivButtons.appendChild(toDoButton);
    itemDivButtons.appendChild(toDelButton);
    itemDiv.appendChild(itemDivButtons);
    taskListElement.appendChild(itemDiv);

    if (taskBox[key].isComplete) {
      itemDiv.classList.add("completed");
      itemDivButtons.replaceChild(markReady, toDoButton);
    }
  }
  writeToLocalStorage(taskBox);
  getStatistics();
};

const getStatistics = () => {
  document.querySelector(".stats__total").innerHTML =
    getDataFromLocalStorage().length;
  document.querySelector(".stats__completed").innerHTML =
    getCompletedItems(taskBox);
};

const taskManagement = (event) => {
  if (event.path[1].className === "todo-button") {
    for (const key in taskBox) {
      if (taskBox[key].name === event.path[3].children[0].innerText.trim()) {
        taskBox[key].isComplete = true;
        taskBox.push(taskBox[key]);
        taskBox.splice([key], 1);
        writeToLocalStorage(taskBox);
        fillTheList();
      }
    }
  }

  if (event.path[1].className === "delete-button") {
    for (const key in taskBox) {
      if (taskBox[key].name === event.path[3].children[0].innerText.trim()) {
        taskBox.splice([key], 1);
        writeToLocalStorage(taskBox);
        fillTheList();
      }
    }
  }
};

fillTheList();

addNewTaskButton.addEventListener("click", addNewTask);
clearAllButton.addEventListener("click", clearAll);
taskListElement.addEventListener("click", taskManagement);
