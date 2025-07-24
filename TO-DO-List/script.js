// DOM Elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        taskItem.draggable = true;
        taskItem.dataset.index = index;

        const taskText = document.createElement("span");
        taskText.classList.add("task-text");
        taskText.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTask(index));

        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });

    // Add drag-and-drop functionality
    addDragAndDrop();
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text });
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Drag-and-drop functionality
function addDragAndDrop() {
    let draggedItem = null;

    taskList.querySelectorAll(".task-item").forEach(item => {
        item.addEventListener("dragstart", () => {
            draggedItem = item;
            setTimeout(() => item.classList.add("dragging"), 0);
        });

        item.addEventListener("dragend", () => {
            setTimeout(() => item.classList.remove("dragging"), 0);
            draggedItem = null;
        });
    });

    taskList.addEventListener("dragover", e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const currentItem = document.querySelector(".dragging");
        if (afterElement) {
            taskList.insertBefore(currentItem, afterElement);
        } else {
            taskList.appendChild(currentItem);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Theme toggle
themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light-theme");
    themeLabel.textContent = themeToggle.checked ? "Light Mode" : "Dark Mode";
});

// Initial render
renderTasks();
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});