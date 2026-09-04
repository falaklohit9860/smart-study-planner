/* =====================================================
   SMART STUDY PLANNER
   JAVASCRIPT
===================================================== */


/* =====================================================
   DATA
===================================================== */

let subjects =
    JSON.parse(localStorage.getItem("subjects")) || [];

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

let schedules =
    JSON.parse(localStorage.getItem("schedules")) || [];

let studyHours =
    Number(localStorage.getItem("studyHours")) || 0;

let targetHours =
    Number(localStorage.getItem("targetHours")) || 4;

let streak =
    Number(localStorage.getItem("studyStreak")) || 0;


/* =====================================================
   DOM ELEMENTS
===================================================== */

const navItems =
    document.querySelectorAll(".nav-item[data-section]");

const sections =
    document.querySelectorAll(".page-section");

const pageTitle =
    document.getElementById("pageTitle");

const currentDate =
    document.getElementById("currentDate");


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "subjects",
        JSON.stringify(subjects)
    );

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "schedules",
        JSON.stringify(schedules)
    );

    localStorage.setItem(
        "studyHours",
        studyHours
    );

    localStorage.setItem(
        "targetHours",
        targetHours
    );

    localStorage.setItem(
        "studyStreak",
        streak
    );
}


/* =====================================================
   DATE
===================================================== */

function updateDate() {

    const now = new Date();

    currentDate.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    document.getElementById(
        "scheduleDay"
    ).textContent = now.getDate();

    document.getElementById(
        "scheduleMonth"
    ).textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                month: "short"
            }
        ).toUpperCase();

    document.getElementById(
        "scheduleDateText"
    ).textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long"
            }
        );
}

updateDate();


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(sectionId) {

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });

    navItems.forEach(item => {

        item.classList.remove("active");

    });

    const selected =
        document.getElementById(sectionId);

    const nav =
        document.querySelector(
            `.nav-item[data-section="${sectionId}"]`
        );

    if (selected) {

        selected.classList.add(
            "active-section"
        );

    }

    if (nav) {

        nav.classList.add("active");

    }

    const titles = {

        dashboard: "Dashboard",

        subjects: "My Subjects",

        tasks: "Tasks",

        schedule: "Study Plan",

        timer: "Study Timer",

        progress: "My Progress"

    };

    pageTitle.textContent =
        titles[sectionId] || "Dashboard";


    /* Close mobile sidebar */

    document
        .querySelector(".sidebar")
        .classList.remove(
            "mobile-open"
        );


    if (sectionId === "progress") {

        updateCharts();

    }

}


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            showSection(
                item.dataset.section
            );

        }
    );

});


/* Buttons that navigate */

document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showSection(
                button.dataset.go
            );

        }
    );

});


/* Mobile menu */

document
    .getElementById("mobileMenu")
    .addEventListener(
        "click",
        () => {

            document
                .querySelector(".sidebar")
                .classList.toggle(
                    "mobile-open"
                );

        }
    );


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    document.getElementById(
        "studyHours"
    ).textContent =
        studyHours.toFixed(1) + "h";


    const completed =
        tasks.filter(
            task => task.completed
        ).length;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "subjectCount"
    ).textContent =
        subjects.length;


    document.getElementById(
        "studyStreak"
    ).textContent =
        streak + " days";


    document.getElementById(
        "goalHours"
    ).textContent =
        studyHours.toFixed(1);


    document.getElementById(
        "targetHours"
    ).textContent =
        targetHours;


    let percentage =
        targetHours > 0
            ? Math.round(
                (studyHours / targetHours) * 100
            )
            : 0;


    percentage =
        Math.min(
            percentage,
            100
        );


    document.getElementById(
        "goalPercentage"
    ).textContent =
        percentage + "%";


    const degrees =
        percentage * 3.6;


    document.getElementById(
        "dailyProgress"
    ).style.background =
        `conic-gradient(
            var(--primary) ${degrees}deg,
            var(--border) ${degrees}deg
        )`;


    renderDashboardTasks();

}


/* =====================================================
   DASHBOARD TASKS
===================================================== */

function renderDashboardTasks() {

    const container =
        document.getElementById(
            "dashboardTasks"
        );


    const pending =
        tasks
            .filter(task => !task.completed)
            .slice(0, 4);


    if (pending.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-circle-check"></i>
                <p>All tasks completed! 🎉</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        pending.map(task => {

            return createTaskHTML(
                task,
                true
            );

        }).join("");


    addTaskListeners();

}


/* =====================================================
   SUBJECTS
===================================================== */

function renderSubjects() {

    const grid =
        document.getElementById(
            "subjectGrid"
        );


    if (subjects.length === 0) {

        grid.innerHTML = `
            <div class="empty-state large">
                <i class="fa-solid fa-book"></i>
                <h3>No subjects added</h3>
                <p>
                    Add your first subject
                    to start planning.
                </p>
            </div>
        `;

        return;
    }


    grid.innerHTML =
        subjects.map(
            (subject, index) => {

                return `

                <div class="subject-card">

                    <div class="subject-top">

                        <div class="subject-icon">
                            <i class="fa-solid fa-book-open"></i>
                        </div>

                        <button
                            class="delete-btn"
                            onclick="deleteSubject(${index})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>


                    <h3>
                        ${escapeHTML(subject.name)}
                    </h3>

                    <p>
                        ${subject.priority} Priority
                    </p>


                    <div class="subject-progress">

                        <div class="progress-label">

                            <span>Progress</span>

                            <span>
                                ${subject.progress || 0}%
                            </span>

                        </div>

                        <div class="progress-bar">

                            <div
                                class="progress-fill"
                                style="width:${subject.progress || 0}%"
                            ></div>

                        </div>

                    </div>


                    <div class="subject-meta">

                        <span>
                            <i class="fa-solid fa-clock"></i>
                            ${subject.hours} hrs target
                        </span>

                        <span>
                            ${subject.progress || 0}% done
                        </span>

                    </div>

                </div>

                `;

            }
        ).join("");

}


/* =====================================================
   ADD SUBJECT
===================================================== */

document
    .getElementById("addSubjectBtn")
    .addEventListener(
        "click",
        () => {

            openModal("subjectModal");

        }
    );


document
    .getElementById("subjectForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "subjectName"
                    )
                    .value
                    .trim();


            const hours =
                Number(
                    document
                        .getElementById(
                            "subjectHours"
                        )
                        .value
                );


            const priority =
                document
                    .getElementById(
                        "subjectPriority"
                    )
                    .value;


            if (!name) {

                return;

            }


            subjects.push({

                id: Date.now(),

                name,

                hours,

                priority,

                progress: 0

            });


            saveData();

            renderSubjects();

            updateSubjectDropdowns();

            updateDashboard();

            updateProgressSubjects();

            closeModal(
                "subjectModal"
            );


            event.target.reset();

        }
    );


/* =====================================================
   DELETE SUBJECT
===================================================== */

function deleteSubject(index) {

    const subject =
        subjects[index];


    if (!confirm(
        `Delete "${subject.name}"?`
    )) {

        return;

    }


    subjects.splice(
        index,
        1
    );


    saveData();

    renderSubjects();

    updateSubjectDropdowns();

    updateDashboard();

    updateProgressSubjects();

}


/* =====================================================
   SUBJECT DROPDOWNS
===================================================== */

function updateSubjectDropdowns() {

    const taskSubject =
        document.getElementById(
            "taskSubject"
        );

    const scheduleSubject =
        document.getElementById(
            "scheduleSubject"
        );


    taskSubject.innerHTML =
        `<option value="">General</option>`;


    scheduleSubject.innerHTML =
        `<option value="">Select Subject</option>`;


    subjects.forEach(subject => {

        taskSubject.innerHTML += `
            <option value="${escapeHTML(subject.name)}">
                ${escapeHTML(subject.name)}
            </option>
        `;


        scheduleSubject.innerHTML += `
            <option value="${escapeHTML(subject.name)}">
                ${escapeHTML(subject.name)}
            </option>
        `;

    });

}


/* =====================================================
   TASKS
===================================================== */

let currentFilter = "all";


function createTaskHTML(
    task,
    compact = false
) {

    return `

        <div
            class="task-item ${task.completed ? "completed" : ""}"
            data-task-id="${task.id}"
        >

            <button
                class="task-check ${
                    task.completed
                        ? "completed"
                        : ""
                }"
                onclick="toggleTask(${task.id})"
            >

                ${
                    task.completed
                        ? `<i class="fa-solid fa-check"></i>`
                        : ""
                }

            </button>


            <div class="task-content">

                <strong>
                    ${escapeHTML(task.name)}
                </strong>

                <p>
                    ${
                        escapeHTML(
                            task.subject || "General"
                        )
                    }
                    • Due ${formatDate(task.date)}
                </p>

            </div>


            <span
                class="priority ${task.priority}"
            >
                ${task.priority}
            </span>


            ${
                compact
                    ? ""
                    : `

                    <div class="task-actions">

                        <button
                            class="icon-btn"
                            onclick="deleteTask(${task.id})"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>

                    </div>

                    `
            }

        </div>

    `;

}


function renderTasks() {

    const list =
        document.getElementById(
            "taskList"
        );


    let filtered =
        tasks;


    if (currentFilter === "pending") {

        filtered =
            tasks.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filtered =
            tasks.filter(
                task => task.completed
            );

    }


    if (filtered.length === 0) {

        list.innerHTML = `
            <div class="empty-state large">
                <i class="fa-solid fa-list-check"></i>
                <h3>No tasks found</h3>
                <p>
                    Add a task to organize
                    your study.
                </p>
            </div>
        `;

        return;

    }


    list.innerHTML =
        filtered.map(
            task => createTaskHTML(
                task,
                false
            )
        ).join("");


    addTaskListeners();

}


/* =====================================================
   TASK FILTER
===================================================== */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    });


/* =====================================================
   ADD TASK
===================================================== */

document
    .getElementById("addTaskBtn")
    .addEventListener(
        "click",
        () => {

            openModal("taskModal");

        }
    );


document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "taskName"
                    )
                    .value
                    .trim();


            const subject =
                document
                    .getElementById(
                        "taskSubject"
                    )
                    .value;


            const priority =
                document
                    .getElementById(
                        "taskPriority"
                    )
                    .value;


            const date =
                document
                    .getElementById(
                        "taskDate"
                    )
                    .value;


            if (!name || !date) {

                return;

            }


            tasks.push({

                id: Date.now(),

                name,

                subject,

                priority,

                date,

                completed: false

            });


            saveData();

            renderTasks();

            renderDashboardTasks();

            updateDashboard();

            updateCharts();


            closeModal(
                "taskModal"
            );


            event.target.reset();

        }
    );


/* =====================================================
   TOGGLE TASK
===================================================== */

function toggleTask(id) {

    const task =
        tasks.find(
            item => item.id === id
        );


    if (!task) {

        return;

    }


    task.completed =
        !task.completed;


    saveData();

    renderTasks();

    renderDashboardTasks();

    updateDashboard();

    updateCharts();

}


/* =====================================================
   DELETE TASK
===================================================== */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveData();

    renderTasks();

    renderDashboardTasks();

    updateDashboard();

    updateCharts();

}


/* =====================================================
   TASK LISTENERS
===================================================== */

function addTaskListeners() {

    /* Reserved for future task interactions */

}


/* =====================================================
   SCHEDULE
===================================================== */

document
    .getElementById("addScheduleBtn")
    .addEventListener(
        "click",
        () => {

            if (subjects.length === 0) {

                alert(
                    "Please add a subject first."
                );

                showSection("subjects");

                return;

            }

            openModal(
                "scheduleModal"
            );

        }
    );


document
    .getElementById("scheduleForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const subject =
                document
                    .getElementById(
                        "scheduleSubject"
                    )
                    .value;


            const start =
                document
                    .getElementById(
                        "startTime"
                    )
                    .value;


            const end =
                document
                    .getElementById(
                        "endTime"
                    )
                    .value;


            const topic =
                document
                    .getElementById(
                        "studyTopic"
                    )
                    .value
                    .trim();


            if (
                !subject ||
                !start ||
                !end ||
                !topic
            ) {

                return;

            }


            schedules.push({

                id: Date.now(),

                subject,

                start,

                end,

                topic

            });


            saveData();

            renderSchedules();

            closeModal(
                "scheduleModal"
            );


            event.target.reset();

        }
    );


function renderSchedules() {

    const list =
        document.getElementById(
            "scheduleList"
        );


    if (schedules.length === 0) {

        list.innerHTML = `
            <div class="empty-state large">
                <i class="fa-solid fa-calendar"></i>
                <h3>No study sessions</h3>
                <p>
                    Add your first study session.
                </p>
            </div>
        `;

        return;

    }


    const sorted =
        [...schedules].sort(
            (a, b) =>
                a.start.localeCompare(
                    b.start
                )
        );


    list.innerHTML =
        sorted.map(
            session => `

            <div class="timeline-item">

                <div class="timeline-time">
                    ${formatTime(session.start)}
                </div>

                <div class="timeline-line"></div>

                <div class="timeline-content">

                    <div>

                        <h4>
                            ${escapeHTML(
                                session.topic
                            )}
                        </h4>

                        <p>
                            ${escapeHTML(
                                session.subject
                            )}
                            •
                            ${formatTime(session.start)}
                            -
                            ${formatTime(session.end)}
                        </p>

                    </div>

                    <button
                        class="icon-btn"
                        onclick="deleteSchedule(${session.id})"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

        `
        ).join("");

}


function deleteSchedule(id) {

    schedules =
        schedules.filter(
            session =>
                session.id !== id
        );


    saveData();

    renderSchedules();

}


/* =====================================================
   TIMER
===================================================== */

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;


const timerDisplay =
    document.getElementById(
        "timerDisplay"
    );


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );

    const seconds =
        timerSeconds % 60;


    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

    if (timerRunning) {

        clearInterval(
            timerInterval
        );

        timerRunning = false;

        document.getElementById(
            "timerStart"
        ).innerHTML =
            `<i class="fa-solid fa-play"></i> Start`;

        return;

    }


    timerRunning = true;


    document.getElementById(
        "timerStart"
    ).innerHTML =
        `<i class="fa-solid fa-pause"></i> Pause`;


    timerInterval =
        setInterval(
            () => {

                if (timerSeconds > 0) {

                    timerSeconds--;

                    updateTimerDisplay();

                } else {

                    clearInterval(
                        timerInterval
                    );

                    timerRunning = false;

                    document.getElementById(
                        "timerStart"
                    ).innerHTML =
                        `<i class="fa-solid fa-play"></i> Start`;


                    studyHours += 25 / 60;

                    saveData();

                    updateDashboard();

                    alert(
                        "Focus session complete! 🎉 Take a break."
                    );

                }

            },
            1000
        );

}


document
    .getElementById("timerStart")
    .addEventListener(
        "click",
        startTimer
    );


document
    .getElementById("timerReset")
    .addEventListener(
        "click",
        () => {

            clearInterval(
                timerInterval
            );

            timerRunning = false;

            timerSeconds = 25 * 60;

            updateTimerDisplay();

            document.getElementById(
                "timerStart"
            ).innerHTML =
                `<i class="fa-solid fa-play"></i> Start`;

        }
    );


document
    .querySelectorAll(".timer-mode-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".timer-mode-btn"
                    )
                    .forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                clearInterval(
                    timerInterval
                );

                timerRunning = false;


                const minutes =
                    Number(
                        button.dataset.minutes
                    );


                timerSeconds =
                    minutes * 60;


                updateTimerDisplay();


                document.getElementById(
                    "timerStart"
                ).innerHTML =
                    `<i class="fa-solid fa-play"></i> Start`;

            }
        );

    });


/* =====================================================
   DAILY GOAL
===================================================== */

document
    .getElementById("changeGoal")
    .addEventListener(
        "click",
        () => {

            const newGoal =
                prompt(
                    "Enter your daily study goal in hours:",
                    targetHours
                );


            if (
                newGoal !== null &&
                Number(newGoal) > 0
            ) {

                targetHours =
                    Number(newGoal);


                saveData();

                updateDashboard();

            }

        }
    );


/* =====================================================
   CHARTS
===================================================== */

let weeklyChart = null;

let taskChart = null;


function updateCharts() {

    createWeeklyChart();

    createTaskChart();

}


function createWeeklyChart() {

    const canvas =
        document.getElementById(
            "weeklyChart"
        );


    if (!canvas) {

        return;

    }


    if (weeklyChart) {

        weeklyChart.destroy();

    }


    const labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
    ];


    const values = [
        2.5,
        3,
        1.5,
        4,
        2,
        3.5,
        studyHours
    ];


    weeklyChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Study Hours",

                            data:
                                values,

                            borderRadius:
                                8

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            display: false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            grid: {

                                color:
                                    "rgba(148,163,184,0.15)"

                            }

                        },

                        x: {

                            grid: {

                                display: false

                            }

                        }

                    }

                }

            }
        );

}


function createTaskChart() {

    const canvas =
        document.getElementById(
            "taskChart"
        );


    if (!canvas) {

        return;

    }


    if (taskChart) {

        taskChart.destroy();

    }


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        tasks.filter(
            task => !task.completed
        ).length;


    taskChart =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: [
                        "Completed",
                        "Pending"
                    ],

                    datasets: [

                        {

                            data: [
                                completed,
                                pending
                            ],

                            borderWidth: 0

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    cutout: "70%",

                    plugins: {

                        legend: {

                            position: "bottom"

                        }

                    }

                }

            }
        );

}


/* =====================================================
   SUBJECT PROGRESS
===================================================== */

function updateProgressSubjects() {

    const container =
        document.getElementById(
            "progressSubjects"
        );


    if (subjects.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <p>No subjects available.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        subjects.map(
            subject => `

            <div class="progress-subject">

                <div class="progress-label">

                    <span>
                        ${escapeHTML(
                            subject.name
                        )}
                    </span>

                    <span>
                        ${subject.progress || 0}%
                    </span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${
                            subject.progress || 0
                        }%"
                    ></div>

                </div>

            </div>

        `
        ).join("");

}


/* =====================================================
   MODALS
===================================================== */

function openModal(id) {

    document
        .getElementById(id)
        .classList.add("active");

}


function closeModal(id) {

    document
        .getElementById(id)
        .classList.remove("active");

}


document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                closeModal(
                    button.dataset.close
                );

            }
        );

    });


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =====================================================
   DARK MODE
===================================================== */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


function updateThemeIcon() {

    const icon =
        themeToggle.querySelector(
            "i"
        );

    const span =
        themeToggle.querySelector(
            "span"
        );


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        icon.className =
            "fa-solid fa-sun";

        span.textContent =
            "Light Mode";

    } else {

        icon.className =
            "fa-solid fa-moon";

        span.textContent =
            "Dark Mode";

    }

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        localStorage.setItem(
            "darkMode",
            document.body.classList.contains(
                "dark"
            )
        );


        updateThemeIcon();

    }
);


if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

}


updateThemeIcon();


/* =====================================================
   MOTIVATIONAL QUOTES
===================================================== */

const quotes = [

    "Success is the sum of small efforts, repeated day in and day out.",

    "Don't watch the clock; do what it does. Keep going.",

    "The secret of getting ahead is getting started.",

    "Small progress is still progress.",

    "Your future is created by what you do today.",

    "Focus on progress, not perfection.",

    "Study now, shine later."

];


function updateQuote() {

    const today =
        new Date().getDate();


    document.getElementById(
        "dailyQuote"
    ).textContent =
        quotes[
            today % quotes.length
        ];

}


updateQuote();


/* =====================================================
   HELPERS
===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "No date";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short"
        }
    );

}


function formatTime(time) {

    if (!time) {

        return "";

    }


    const [
        hours,
        minutes
    ] =
        time.split(":");


    const date =
        new Date();

    date.setHours(
        Number(hours),
        Number(minutes)
    );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initializeApp() {

    updateDate();

    renderSubjects();

    renderTasks();

    renderSchedules();

    updateSubjectDropdowns();

    updateDashboard();

    updateProgressSubjects();

    updateTimerDisplay();

}


initializeApp();