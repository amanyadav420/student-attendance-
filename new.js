// Get HTML elements
const dateInput = document.getElementById("date");
const searchInput = document.getElementById("search");
const studentTable = document.getElementById("studentTable");

const totalStudents = document.getElementById("totalStudents");
const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const attendancePercentage = document.getElementById("attendancePercentage");

const addStudentBtn = document.getElementById("addStudentBtn");
const studentForm = document.getElementById("studentForm");

const studentName = document.getElementById("studentName");
const studentRoll = document.getElementById("studentRoll");

const saveStudentBtn = document.getElementById("saveStudentBtn");
const cancelBtn = document.getElementById("cancelBtn");

const emptyMessage = document.getElementById("emptyMessage");


// Load students from localStorage
let students = JSON.parse(localStorage.getItem("students")) || [];


// Get today's date
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Set today's date
dateInput.value = getToday();


// Save students
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}


// Show students
function renderStudents() {

    studentTable.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchText) ||
        student.roll.toLowerCase().includes(searchText)
    );

    if (filteredStudents.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }


    filteredStudents.forEach((student, index) => {

        const status = getAttendanceStatus(student.id);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${student.roll}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>
                <button 
                    class="status-btn ${status === "Present" ? "present" : "absent"}"
                    onclick="toggleAttendance(${student.id})"
                >
                    ${status}
                </button>
            </td>

            <td>
                <button 
                    class="delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>
            </td>
        `;

        studentTable.appendChild(row);
    });

    updateDashboard();
}


// Get attendance status
function getAttendanceStatus(studentId) {

    const date = dateInput.value;

    const attendance = JSON.parse(
        localStorage.getItem("attendance")
    ) || {};

    if (
        attendance[date] &&
        attendance[date][studentId]
    ) {
        return attendance[date][studentId];
    }

    return "Absent";
}


// Toggle attendance
function toggleAttendance(studentId) {

    const date = dateInput.value;

    let attendance = JSON.parse(
        localStorage.getItem("attendance")
    ) || {};


    if (!attendance[date]) {
        attendance[date] = {};
    }


    const currentStatus =
        attendance[date][studentId] || "Absent";


    if (currentStatus === "Absent") {
        attendance[date][studentId] = "Present";
    } else {
        attendance[date][studentId] = "Absent";
    }


    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );


    renderStudents();
}


// Delete student
function deleteStudent(studentId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
        return;
    }


    students = students.filter(
        student => student.id !== studentId
    );


    saveStudents();

    renderStudents();
}


// Add student button
addStudentBtn.addEventListener("click", () => {

    studentForm.classList.remove("hidden");

    studentName.focus();

});


// Cancel button
cancelBtn.addEventListener("click", () => {

    studentForm.classList.add("hidden");

    studentName.value = "";
    studentRoll.value = "";

});


// Save student
saveStudentBtn.addEventListener("click", () => {

    const name = studentName.value.trim();
    const roll = studentRoll.value.trim();


    if (name === "" || roll === "") {

        alert("Please enter student name and roll number.");

        return;
    }


    // Check duplicate roll number
    const existingStudent = students.find(
        student => student.roll === roll
    );


    if (existingStudent) {

        alert("A student with this roll number already exists.");

        return;
    }


    const newStudent = {

        id: Date.now(),

        name: name,

        roll: roll

    };


    students.push(newStudent);

    saveStudents();


    studentName.value = "";
    studentRoll.value = "";

    studentForm.classList.add("hidden");


    renderStudents();

});


// Search students
searchInput.addEventListener(
    "input",
    renderStudents
);


// Change date
dateInput.addEventListener(
    "change",
    renderStudents
);


// Update dashboard
function updateDashboard() {

    const total = students.length;

    let present = 0;

    let absent = 0;


    students.forEach(student => {

        const status = getAttendanceStatus(student.id);

        if (status === "Present") {
            present++;
        } else {
            absent++;
        }

    });


    let percentage = 0;

    if (total > 0) {
        percentage = Math.round(
            (present / total) * 100
        );
    }


    totalStudents.textContent = total;

    presentCount.textContent = present;

    absentCount.textContent = absent;

    attendancePercentage.textContent =
        percentage + "%";
}


// Initial display
renderStudents();
