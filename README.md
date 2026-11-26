# Student Management System – Full-Stack Web Application

A full-stack, enterprise-grade Student Management System developed as a collaborative training project.

---

## 👥 Team & Work Distribution

| Member | Role | Responsibility | Tech Stack |
|---|---|---|---|
| **Vedanti** | Frontend Developer | UI Design, Bootstrap Layout, Responsive CSS, Client Validation, Fetch API, DOM Rendering | HTML5, CSS3, JavaScript ES6+, Bootstrap 5, Bootstrap Icons |
| **Seshadri** | Backend Developer | Spring Boot REST APIs, Service Layer, Repository Layer, JPA/Hibernate Entities, DTOs, MySQL Persistence | Java 17+, Spring Boot 3.x, Spring Data JPA, Hibernate, MySQL |

---

## 🏗️ Architecture & Communication Flow

```text
Frontend (HTML5, CSS3, Bootstrap 5, JavaScript ES6)
         ↓  (JSON over HTTP via Fetch API)
Spring Boot REST Controllers (StudentController, CourseController)
         ↓  (DTO validation via Jakarta Validation)
Service Layer (StudentServiceImpl, CourseServiceImpl)
         ↓  (Business Logic & DTO ↔ Entity Mapping)
Repository Layer (Spring Data JPA / Hibernate)
         ↓  (SQL Queries)
MySQL Database (student_management: tables `courses` & `students`)
```

---

## 📁 Repository Directory Structure

```text
student-management-system/
├── frontend/
│   ├── index.html            # Dashboard (KPI stat cards, recent enrollments)
│   ├── students.html         # Student Management (CRUD, search, view modal)
│   ├── courses.html          # Course Management (Course listing, add course)
│   ├── css/
│   │   ├── style.css         # Custom UI theme, badges, cards, tables, toasts
│   │   └── responsive.css    # Responsive breakpoints for mobile and tablet
│   ├── js/
│   │   ├── config.js         # Base URL (http://localhost:8080/api) and endpoints
│   │   ├── validation.js     # Form validation rules & Toast notification system
│   │   ├── course.js         # Course API calls (GET/POST) & dropdown population
│   │   ├── student.js        # Student CRUD & Search API integration
│   │   └── dashboard.js      # Statistics calculation & recent students table
│   └── README.md             # Frontend-specific documentation & Viva prep
├── backend/
│   ├── pom.xml               # Maven dependencies (Spring Web, JPA, MySQL, Validation)
│   ├── src/main/java/com/training/Student_Management/
│   │   ├── StudentManagementApplication.java
│   │   ├── config/CorsConfig.java
│   │   ├── controller/StudentController.java, CourseController.java
│   │   ├── dto/StudentRequestDTO.java, StudentResponseDTO.java, CourseRequestDTO.java, CourseResponseDTO.java
│   │   ├── entity/Student.java, Course.java
│   │   ├── repository/StudentRepository.java, CourseRepository.java
│   │   ├── service/StudentService.java, StudentServiceImpl.java, CourseService.java, CourseServiceImpl.java
│   │   └── exception/GlobalExceptionHandler.java, ResourceNotFoundException.java, DuplicateResourceException.java
│   └── src/main/resources/application.properties
├── database/
│   └── student_management.sql  # MySQL schema and initial seed data
├── postman/
│   └── student-management.postman_collection.json # 8 REST API test requests
└── README.md                 # Complete project documentation
```

---

## 🚀 Setup & Execution Guide

### 1. Database Setup (MySQL)
1. Ensure MySQL Server is running on port `3306`.
2. Open MySQL Workbench, MySQL Command Line Client, or your favorite GUI.
3. Execute the script located in `database/student_management.sql`:
   ```bash
   mysql -u root -p < database/student_management.sql
   ```
   Or execute directly in MySQL Workbench:
   - Run `CREATE DATABASE student_management;`
   - Run table creation and seed scripts in `database/student_management.sql`.

### 2. Backend Setup (Spring Boot)
1. Open the `backend/` folder in **IntelliJ IDEA** (or VS Code).
2. Verify database credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_management
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
3. Run the Spring Boot application:
   - In IntelliJ IDEA: Open `StudentManagementApplication.java` and click **Run**.
   - Or via command line:
     ```bash
     cd backend
     ./mvnw spring-boot:run
     ```
4. Verify backend is running by opening:
   - `http://localhost:8080/api/courses`
   - You should receive an HTTP 200 JSON array of courses.

### 3. Frontend Setup (Live Server)
1. Open the project in **VS Code**.
2. Install the **Live Server** extension if not already installed (`ritwickdey.liveserver`).
3. Right-click on `frontend/index.html` and choose **"Open with Live Server"**.
4. The frontend will launch at:
   - `http://127.0.0.1:5500/frontend/index.html` (or `http://localhost:5500/frontend/index.html`)
5. The live badge in the top-right navbar will show:
   - 🟢 **Backend Connected** (when Spring Boot is responding)
   - 🔴 **Backend Offline** (with retry button if backend is stopped)

---

## 📡 REST API Specification (8 Endpoints)

Base URL: `http://localhost:8080/api`

| # | Endpoint | Method | Purpose | Success Status | Request Body |
|---|---|---|---|---|---|
| 1 | `/courses` | `POST` | Create a new course | `201 Created` | `CourseRequestDTO` (JSON) |
| 2 | `/courses` | `GET` | Retrieve all courses | `200 OK` | None |
| 3 | `/students` | `POST` | Register a new student | `201 Created` | `StudentRequestDTO` (JSON) |
| 4 | `/students` | `GET` | Retrieve all students | `200 OK` | None |
| 5 | `/students/{id}` | `GET` | Get student by ID | `200 OK` | None |
| 6 | `/students/{id}` | `PUT` | Update student details | `200 OK` | `StudentRequestDTO` (JSON) |
| 7 | `/students/search?name={query}` | `GET` | Search students by name | `200 OK` | None |
| 8 | `/students/{id}` | `DELETE` | Delete student record | `204 No Content` | None |

### Sample JSON Payloads

#### Create Course (`POST /api/courses`):
```json
{
  "courseName": "Java Full Stack Development",
  "courseCode": "JFS101",
  "duration": "6 Months",
  "description": "Core Java, Spring Boot, JPA, MySQL, and Modern Web Frontend.",
  "status": "Active"
}
```

#### Create Student (`POST /api/students`):
```json
{
  "fullName": "Rahul Patil",
  "email": "rahul.patil@example.com",
  "mobileNumber": "9876543210",
  "gender": "Male",
  "dateOfBirth": "2003-05-15",
  "address": "Pune, Maharashtra",
  "enrollmentDate": "2026-11-25",
  "status": "Active",
  "courseId": 1
}
```

---

## 🧪 Postman Testing Sequence

The collection is provided in `postman/student-management.postman_collection.json`.

1. Import `postman/student-management.postman_collection.json` into Postman.
2. Ensure variable `baseUrl` is set to `http://localhost:8080/api`.
3. Execute in sequence:
   1. `POST /courses` &rarr; Verify status `201 Created`.
   2. `GET /courses` &rarr; Verify status `200 OK` and check generated `courseId`.
   3. `POST /students` &rarr; Assign `courseId: 1` &rarr; Verify status `201 Created`.
   4. `GET /students` &rarr; Verify returned student list includes enrolled course name.
   5. `GET /students/1` &rarr; Verify single record fetch.
   6. `PUT /students/1` &rarr; Update address or status &rarr; Verify status `200 OK`.
   7. `GET /students/search?name=Rahul` &rarr; Verify case-insensitive search.
   8. `DELETE /students/1` &rarr; Verify status `204 No Content`.
   9. Test error scenarios: Duplicate email (`409 Conflict`), Missing student (`404 Not Found`), Invalid phone number (`400 Bad Request`).

---

## 🤝 GitHub Collaboration Best Practices (Vedanti & Seshadri)

### 1. Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd student-management-system
```

### 2. Feature Branches (Never commit directly to main)
- **Vedanti (Frontend):**
  ```bash
  git checkout -b feature/frontend-vedanti
  ```
- **Seshadri (Backend):**
  ```bash
  git checkout -b feature/backend-seshadri
  ```

### 3. Committing Changes
Always write clear and imperative commit messages:
```bash
git add .
git commit -m "Integrate student CRUD and search APIs with error handling"
git push origin feature/frontend-vedanti
```

### 4. Pulling Updates & Avoiding Overwrites
Before starting new work or pushing:
```bash
# Fetch latest main branch
git checkout main
git pull origin main

# Rebase or merge main into your feature branch
git checkout feature/frontend-vedanti
git merge main
```

### 5. Resolving Merge Conflicts
If Git reports a conflict:
1. Open the conflicted files in VS Code.
2. Look for conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`).
3. Consult each other to pick the correct combined code.
4. Stage the resolved files: `git add <resolved-file>`
5. Complete the merge: `git commit -m "Resolve merge conflict between frontend and backend"`

---

## ✅ Integration Acceptance Checklist

- [x] **Database:** MySQL database `student_management` and both tables (`courses`, `students`) defined with foreign key constraint.
- [x] **Backend:** Spring Boot 3.x project running on port `8080` with layered architecture (Controller &rarr; Service &rarr; Repository &rarr; Entity/DTO).
- [x] **CORS:** CORS configured for Live Server origins (`http://127.0.0.1:5500` and `http://localhost:5500`).
- [x] **Frontend:** HTML5, CSS3, Bootstrap 5, responsive layouts for mobile and desktop.
- [x] **Course Integration:** Available courses loaded dynamically to populate the student registration course dropdown.
- [x] **Student Integration:** Complete Add, View, View by ID, Update, Delete, and Search APIs connected via Fetch API.
- [x] **Dashboard:** Real-time calculation of total students, active students, inactive students, total courses, and recent enrollments.
- [x] **Error Handling:** Graceful handling of HTTP 200, 201, 204 (No Content), 400 (Validation), 404 (Not Found), 409 (Conflict), and server down states.
- [x] **Postman Collection:** Complete 8-request collection with environment variables and sample bodies.
- [x] **Documentation:** Thorough instructions for both developers to run, test, and demonstrate during the viva.

---

## ☁️ Deployment (Vercel + Render)

The frontend is a static site for Vercel. The Spring Boot API runs as a Docker web
service on Render. The backend still uses MySQL, so provide a MySQL database that
is reachable from Render; Render's PostgreSQL database is not a drop-in replacement.

1. Push this repository to GitHub.
2. Create a hosted MySQL database with your chosen provider. Import
   `database/student_management.sql` (if the provider already created the database,
   remove the `CREATE DATABASE` and `USE` statements before importing). Keep its
   connection details private.
3. In Render, create a Blueprint from this repository and use `render.yaml`. Set:
   - `SPRING_DATASOURCE_URL` to the provider's JDBC URL, such as
     `jdbc:mysql://HOST:PORT/student_management` (include provider-required TLS
     options when applicable).
   - `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` to the database
     credentials.
   - `APP_CORS_ALLOWED_ORIGINS` to the exact Vercel site origin, for example
     `https://your-project.vercel.app` (no trailing slash).
4. Wait for the Render service to deploy, then check
   `https://YOUR-RENDER-SERVICE.onrender.com/api/courses`.
5. In Vercel, import the same repository and set **Root Directory** to `frontend`.
   Select **Other** as the framework preset, leave the build command empty, and set
   the output directory to `.`.
6. After Render has assigned its service URL, update `API_BASE_URL` near the top
   of `frontend/js/config.js` to
   `https://YOUR-RENDER-SERVICE.onrender.com/api`, then push the change so Vercel
   redeploys the site.

Set or update the Render environment variables through its dashboard; never commit
database credentials to this repository. If the Vercel domain changes, update
`APP_CORS_ALLOWED_ORIGINS` on Render as well. Render's free web service may sleep
when idle, so the first request after inactivity can take longer.
