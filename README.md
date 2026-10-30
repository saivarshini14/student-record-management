# Student Record Management System 🎓

A modern full-stack web application designed for trainers, professors, and college administration staff to manage student academic records, marks, and branch details seamlessly in one centralized place instead of error-prone manual spreadsheets.

---

## 🌟 Tech Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Frontend** | **React.js 18** (Vite build) | Component-driven architecture, custom responsive CSS design, live form validation, toast notifications |
| **Backend** | **Java Spring Boot REST API** (Java 17, Spring Boot 4/3) | Layered architecture (Controller, Service, Repository), Jakarta Bean Validation, Global Exception Handling |
| **Data Storage** | **H2 Database Engine** | Persistent file-based embedded SQL database (`./data/studentdb`), H2 Web Console |
| **Build Tools** | **Maven** & **npm** | Automated build, JUnit 5 integration tests, production-optimized Vite bundle |

---

## 🚀 Key Features Implemented

1. **Add Student Record**
   - Register students with `Name`, `Roll Number`, `Branch`, and `Marks (0 - 100)`.
   - Real-time client-side checks and backend validation before persisting.
   - Pre-populated branch options with support for custom branch input.

2. **Directory Table View**
   - Clean, responsive table displaying all saved students.
   - Shows Roll Number, Full Name, Branch, Marks (with visual progress bar), Grade (A+ to F), and Pass/Fail status.
   - Interactive column sorting (Roll Number, Name, Branch, Marks).

3. **Edit & Delete Records**
   - **Edit:** Modal prefilled with student details. Allows updating name, branch, roll number, and marks with duplicate and range safeguards.
   - **Delete:** Safe confirmation dialog displaying student information to avoid accidental deletions.

4. **Roll Number Search & Branch Filter**
   - Dedicated search bar targeting student roll numbers (e.g. `CS2024-001`, `IT-015`).
   - Real-time filtering with instant result counts and quick clear/reset buttons.
   - Branch filter dropdown to narrow records by academic department.

5. **Live Total Registered Students & Class Analytics**
   - Highlighted metric banner and navbar badge showing the **Total Registered Students**.
   - Additional trainer metrics: **Class Average Marks**, **Highest Score**, and **Pass Rate %** with passing/failing student counts.

6. **Strict Validation & Helpful Error Feedback**
   - **Roll Number Uniqueness:** Duplicate roll numbers are rejected with HTTP 409 Conflict and a clear error message stating which existing student currently holds that roll number.
   - **Marks Range (0 - 100):** Submissions outside 0 to 100 or non-numeric values are rejected with HTTP 400 Bad Request and descriptive feedback.
   - **Visual Error Indicators:** Form fields highlight in red with inline error notices and server banner alerts.

---

## 📁 Project Structure

```text
student-record-management/
├── backend/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/studentmanagement/
│   │   │   │   ├── StudentManagementApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── StudentController.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── ApiResponse.java
│   │   │   │   │   ├── StudentRequestDto.java
│   │   │   │   │   ├── StudentResponseDto.java
│   │   │   │   │   └── StudentStatsDto.java
│   │   │   │   ├── entity/
│   │   │   │   │   └── Student.java
│   │   │   │   ├── exception/
│   │   │   │   │   ├── DuplicateRollNumberException.java
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   │   └── ValidationErrorResponse.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── StudentRepository.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── StudentService.java
│   │   │   │   │   └── impl/StudentServiceImpl.java
│   │   │   │   └── config/
│   │   │   │       ├── CorsConfig.java
│   │   │   │       └── DataSeeder.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/com/example/studentmanagement/
│   │           └── StudentServiceTest.java
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       ├── api/
│       │   └── studentApi.js
│       └── components/
│           ├── Navbar.jsx
│           ├── StatsOverview.jsx
│           ├── SearchBar.jsx
│           ├── StudentTable.jsx
│           ├── StudentFormModal.jsx
│           ├── DeleteConfirmModal.jsx
│           └── NotificationToast.jsx
├── start-all.bat
├── start-backend.bat
├── start-frontend.bat
└── README.md
```

---

## 🏃 Quick Start Guide

### Option 1: One-Click Startup (Windows)
Double-click `start-all.bat` in the project root:
- Automatically launches the Spring Boot REST API on port `8080`.
- Automatically launches the React frontend development server on port `5173`.

### Option 2: Run Separately from Terminal

#### 1. Start Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run
```
*Backend URL:* `http://localhost:8080/api/students`  
*H2 Database Console:* `http://localhost:8080/h2-console`  
- JDBC URL: `jdbc:h2:file:./data/studentdb;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE`
- Username: `sa`
- Password: *(leave blank)*

#### 2. Start React Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Frontend URL:* `http://localhost:5173`

---

## 📡 REST API Reference

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/students` | Get all students (supports `?rollNumber=...` or `?search=...`) | 200 OK |
| `GET` | `/api/students/{id}` | Get single student by numeric ID | 200 OK / 404 Not Found |
| `GET` | `/api/students/search?rollNumber=...` | Search students by roll number | 200 OK |
| `GET` | `/api/students/stats` | Get registration count, average marks, pass rates | 200 OK |
| `POST` | `/api/students` | Register a new student | 201 Created / 400 Bad Request / 409 Conflict |
| `PUT` | `/api/students/{id}` | Update existing student record | 200 OK / 400 Bad Request / 409 Conflict |
| `DELETE` | `/api/students/{id}` | Delete student record | 200 OK / 404 Not Found |

### Example Request Body (POST / PUT)
```json
{
  "name": "Aarav Sharma",
  "rollNumber": "CS2024-001",
  "branch": "Computer Science",
  "marks": 92.5
}
```

### Example Validation Error Response (400 / 409)
```json
{
  "success": false,
  "message": "Validation failed: Marks must be between 0 and 100",
  "errors": {
    "marks": "Marks must be between 0 and 100"
  },
  "timestamp": "2026-10-30T23:27:30.556"
}
```

---

## 🧪 Automated Testing

To run the JUnit 5 integration test suite:
```powershell
cd backend
mvn test
```
*Verified test scenarios:*
- Student registration and automatic grade/pass assignment
- Duplicate roll number rejection
- Roll number search matching
- Student update and rollback constraints
- Student deletion
- Analytics and stats calculation
