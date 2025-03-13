document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
});

function addTask() {
    let taskInput = document.getElementById('task');
    let deadlineInput = document.getElementById('deadline');
    let taskList = document.getElementById('taskList');

    if (taskInput.value === "" || deadlineInput.value === "") {
        alert("Please enter both task and deadline.");
        return;
    }

    let taskData = {
        task: taskInput.value,
        deadline: deadlineInput.value
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskData);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    deadlineInput.value = "";
}

function showTasks() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('tasksPage').style.display = 'block';
    loadTasks();
}

function showMain() {
    document.getElementById('tasksPage').style.display = 'none';
    document.getElementById('mainPage').style.display = 'block';
}

function loadTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = "";
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.innerHTML = `${task.task} - ${task.deadline} <button class='delete' onclick='removeTask(${index})'>X</button>`;
        taskList.appendChild(li);
    });
}

function removeTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}
