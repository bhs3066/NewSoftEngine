const createStudentForm = document.getElementById("create-student-form");
const getStudentsButton = document.getElementById("get-students");
const deleteStudentButton = document.getElementById("delete-student");
const studentsList = document.getElementById("students-list");

// 학생 생성 POST
createStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const studentNo = document.getElementById("studentNo").value;
  const attendance = 0;

  try {
    const response = await fetch("http://127.0.0.1:8000/api/students/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, studentNo, attendance }),
    });
    const result = await response.json();
    console.log("Student created:", result);
  } catch (error) {
    console.error("Error creating student:", error);
  }
});

async function request() {
  const response = await fetch("http://127.0.0.1:8000/api/students/");
  const students = await response.json();
  studentsList.innerHTML = ""; // 버튼 누르면 다시 초기화 하는 역할 없으면 같은 명단이 계속 추가됨
  students.forEach((student) => {
    const listItem = document.createElement("li");
    listItem.id = "student-container";
    const attendanceColorDiv = document.createElement("div");
    attendanceColorDiv.id = "attendance-color";
    const info = document.createElement("p");
    info.innerText = `이름: ${student.name}

          학번: ${student.studentNo}`;

    listItem.appendChild(attendanceColorDiv);
    listItem.appendChild(info);

    let count = student.attendance;
    attendanceColorDiv.addEventListener("click", async (event) => {
      event.preventDefault();
      count++;
      const newattendance = count % 3;
      console.log(newattendance);
      console.log(typeof newattendance);

      let studentName;
      let studentNo;
      const response = await fetch("http://127.0.0.1:8000/api/students/");
      const students = await response.json();
      students.forEach((searchStudent) => {
        if (searchStudent.name == student.name) {
          studentName = student.name;
          studentNo = student.studentNo;
        }
      });

      console.log(studentName);
      console.log(studentNo);

      await fetch(`http://127.0.0.1:8000/api/students/${student.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName,
          studentNo: studentNo,
          attendance: newattendance,
        }),
      });
    });

    if (student.attendance == 0) {
      attendanceColorDiv.style.backgroundColor = "#3b85cf";
      attendanceColorDiv.innerText = "출석";
    } else if (student.attendance == 2) {
      attendanceColorDiv.style.backgroundColor = "#EDF079";
      attendanceColorDiv.innerText = "지각";
    } else {
      attendanceColorDiv.style.backgroundColor = "#F74248";
      attendanceColorDiv.innerText = "결석";
    }

    studentsList.appendChild(listItem);
  });
}
request();

// 학생 DELETE
deleteStudentButton.addEventListener("click", async () => {
  const studentId = document.getElementById("delete-student-id").value;
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/students/${studentId}/`,
      {
        method: "DELETE",
      }
    );
    if (response.status === 204) {
      console.log(`Student with ID ${studentId} deleted.`);
    } else {
      console.error("Error deleting student:", response.status);
    }
  } catch (error) {
    console.error("Error deleting student:", error);
  }
});
