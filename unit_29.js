const inputElement = document.querySelector(".input-1");
const taskListElement = document.querySelector(".tasklist");
const errorMessage = document.querySelector(".alertMessage");

const getInput = () => inputElement.value.trim();

const getListFromLS = () =>
  (taskBox = JSON.parse(localStorage.getItem("taskBox")) || []);

const setUpListToLS = (taskBox = []) =>
  localStorage.setItem("taskBox", JSON.stringify(taskBox));

function addNewTask() {
  if (getInput().length === 0) {
    errorMessage.textContent =
      "Error: not enough length. Please, input some text.";
    return false;
  }
  errorMessage.textContent = "";
  const newList = {
    text: "",
    isComplete: false
  };
  newList.text = getInput();
  getListFromLS();
  taskBox.push(newList);
  setUpListToLS(taskBox);
  inputElement.value = "";
  fillTheList();
}

const clearAll = () => {
  setUpListToLS();
  taskListElement.innerHTML = "";
  getStatistics();
};

document.querySelector(".button-primary").addEventListener("click", addNewTask);
document.querySelector(".button-secondary").addEventListener("click", clearAll);

const createElement = (elementTag, className, innerHTML = "") => {
  const newElement = document.createElement(elementTag);
  newElement.classList.add(className);
  newElement.innerHTML = innerHTML;
  return newElement;
};

const getCompletedItems = (array) =>
  array.filter(({ isComplete }) => isComplete).length;

function fillTheList() {
  taskListElement.innerHTML = "";
  getListFromLS();

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
      `<span><li>${taskBox[key].text} </li></span>`
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
  setUpListToLS(taskBox);
  getStatistics();
}

function getStatistics() {
  document.querySelector(".stats__total").innerHTML = getListFromLS().length;
  document.querySelector(".stats__completed").innerHTML =
    getCompletedItems(taskBox);
}

fillTheList();

taskListElement.addEventListener("click", taskManagement);

function taskManagement(event) {
  if (event.path[1].className === "todo-button") {
    for (const key in taskBox) {
      if (taskBox[key].text === event.path[3].children[0].innerText.trim()) {
        taskBox[key].isComplete = true;
        taskBox.push(taskBox[key]);
        taskBox.splice([key], 1);
        setUpListToLS(taskBox);
        fillTheList();
      }
    }
  }

  if (event.path[1].className === "delete-button") {
    for (const key in taskBox) {
      if (taskBox[key].text === event.path[3].children[0].innerText.trim()) {
        taskBox.splice([key], 1);
        setUpListToLS(taskBox);
        fillTheList();
      }
    }
  }
}
