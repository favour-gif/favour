document.addEventListener("DOMContentLoaded", () => {
    setMinDate(); // Ensure past dates are disabled
    loadTasks();
});

function setMinDate() {
    let today = new Date().toISOString().split("T")[0];
    document.getElementById("deadline").setAttribute("min", today);
}


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    let taskInput = document.getElementById('task');
    let deadlineInput = document.getElementById('deadline');

    if (taskInput.value === "" || deadlineInput.value === "") {
        alert("Please enter both task and deadline.");
        return;
    }

    let taskData = {
        task: taskInput.value,
        deadline: deadlineInput.value,
        completed: false
    };

    tasks.push(taskData);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    deadlineInput.value = "";
    loadTasks(); // Refresh the task list
}

function showTasks() {
    switchPage('tasksPage');
    loadTasks();
}

function showAnalytics() {
    switchPage('analyticsPage');
    updateAnalytics();
}

function showCalendar() {
    switchPage('calendarPage');
    loadCalendar();
}

function showMain() {
    switchPage('mainPage');
}

function switchPage(pageId) {
    const pages = ['mainPage', 'tasksPage', 'analyticsPage', 'calendarPage'];
    pages.forEach(page => {
        document.getElementById(page).style.display = (page === pageId) ? 'block' : 'none';
    });
}

function loadTasks() {
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed-task' : ''}`;
        li.innerHTML = `
            <div class="task-info">
                <span class="task-name">${task.task}</span>
                <span class="task-date">${calculateDaysLeft(task.deadline)}</span>
            </div>
            <div class="task-actions">
                <button class='edit' onclick='editTask(${index})'>
                <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="Edit" width="20" height="20"></button>
                <button class='delete' onclick='removeTask(${index})'>
                <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Delete" width="20" height="20"></button>
                <input type='checkbox' ${task.completed ? 'checked' : ''} onchange='toggleComplete(${index}, this)'>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Calculate days left for tasks
function calculateDaysLeft(deadline) {
    let today = new Date();
    let dueDate = new Date(deadline);
    let timeDiff = dueDate - today;
    let daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return `${daysLeft} days left`;
}

// Edit Task Functionality
function editTask(index) {
    let newTask = prompt("Edit task name:", tasks[index].task);
    let newDeadline = prompt("Edit deadline (YYYY-MM-DD):", tasks[index].deadline);

    if (newTask !== null && newTask.trim() !== "") {
        tasks[index].task = newTask;
    }
    if (newDeadline !== null && newDeadline.trim() !== "") {
        tasks[index].deadline = newDeadline;
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(); // Refresh the list
}

function updateAnalytics() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    document.getElementById('totalTasks').innerText = totalTasks;
    document.getElementById('completedTasks').innerText = completedTasks;
    document.getElementById('pendingTasks').innerText = pendingTasks;
}

function loadCalendar() {
    let calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = ""; // Clear previous calendar

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        aspectRatio: 1.5,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: '' // Removed week and day views
        },
        events: tasks.map(task => ({
            title: task.task.length > 10 ? task.task.substring(0, 10) + "..." : task.task, // Shortened title
            start: task.deadline,
            color: task.completed ? "#28a745" : "#ff6347",
            extendedProps: {
                fullTitle: task.task, // Store full name
                deadline: task.deadline // Store deadline
            }
        })),
        eventDidMount: function(info) {
            info.el.setAttribute("title", info.event.extendedProps.fullTitle); // Tooltip on hover
        },
        eventClick: function(info) {
            // Show full details in an alert (you can replace this with a modal)
            alert(`Task: ${info.event.extendedProps.fullTitle}\nDeadline: ${info.event.extendedProps.deadline}`);
        }
    });

    calendar.render();
}

function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
    updateAnalytics();
    loadCalendar();
}

function toggleComplete(index, checkbox) {
    tasks[index].completed = checkbox.checked;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
    updateAnalytics();
    loadCalendar();
}

function fetchLeisureTime() {
    // Simulating fetching a JSON file
    fetch("activities.json")
        .then(response => response.json())
        .then(data => {
            // Filter only leisure activities
            let leisureActivities = data.filter(activity => activity.category === "leisure");

            // Sum up the total duration
            let totalLeisureTime = leisureActivities.reduce((sum, activity) => sum + activity.duration, 0);

            // Display the result
            document.getElementById("leisureTime").innerText = `Total Leisure Time: ${totalLeisureTime} minutes`;
        })
        .catch(error => console.error("Error loading JSON:", error));
}

// Call function when the page loads
document.addEventListener("DOMContentLoaded", fetchLeisureTime);
