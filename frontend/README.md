# Student Management System – Frontend Documentation & Viva Guide

**Author / Developer:** Vedanti (Frontend Developer)  
**Assigned Backend Developer:** Seshadri  
**Tech Stack:** HTML5, CSS3, JavaScript (ES6+ Fetch API), Bootstrap 5, Bootstrap Icons  
**Base Backend URL:** `http://localhost:8080/api`

---

## 1. Directory Structure

```text
frontend/
├── index.html            # Dashboard page with statistics & recent enrollments
├── students.html         # Student Management (List, Add, Edit, Delete, Search)
├── courses.html          # Course Management (List, Add Course)
├── css/
│   ├── style.css         # Custom theme styling, cards, tables, badges, toasts
│   └── responsive.css    # Responsive breakpoints for mobile, tablet, and desktop
├── js/
│   ├── config.js         # Centralized API base URL and endpoints
│   ├── validation.js     # Form validation rules and notification toast system
│   ├── course.js         # Course API calls (GET /courses, POST /courses, dropdown)
│   ├── student.js        # Student CRUD & Search API calls
│   └── dashboard.js      # Dashboard metric computations & recent list
└── assets/
    └── images/           # Asset images and icons
```

---

## 2. API Endpoints Integrated

| # | Functionality | HTTP Method | Endpoint | Success Code | Handled In |
|---|---------------|-------------|----------|--------------|------------|
| 1 | Create Student | `POST` | `/api/students` | `201 Created` | `js/student.js` |
| 2 | Get All Students | `GET` | `/api/students` | `200 OK` | `js/student.js` |
| 3 | Get Student by ID | `GET` | `/api/students/{id}` | `200 OK` | `js/student.js` |
| 4 | Update Student | `PUT` | `/api/students/{id}` | `200 OK` | `js/student.js` |
| 5 | Delete Student | `DELETE` | `/api/students/{id}` | `204 No Content` | `js/student.js` |
| 6 | Search by Name | `GET` | `/api/students/search?name={query}` | `200 OK` | `js/student.js` |
| 7 | Create Course | `POST` | `/api/courses` | `201 Created` | `js/course.js` |
| 8 | Get All Courses | `GET` | `/api/courses` | `200 OK` | `js/course.js` |

---

## 3. Mandatory Viva & Demonstration Questions (For Vedanti)

### Q1: Where is the backend base URL configured and how does Fetch use it?
- **Answer:** In [js/config.js](file:///frontend/js/config.js):
  ```javascript
  const API_BASE_URL = "http://localhost:8080/api";
  const CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
      STUDENTS: `${API_BASE_URL}/students`,
      STUDENT_SEARCH: `${API_BASE_URL}/students/search`,
      COURSES: `${API_BASE_URL}/courses`
    },
    DEFAULT_HEADERS: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };
  ```
- Every Fetch call imports or reads `CONFIG.ENDPOINTS`, preventing hardcoded URLs in multiple places.
- For deployment, change `API_BASE_URL` to the Render API URL ending in `/api`.

---

### Q2: How is form data collected, validated, and converted to JSON?
- **Answer:**
  1. **Collection:** Data is extracted from input elements via `document.getElementById("field").value.trim()`.
  2. **Validation:** `validateStudentForm(studentData)` in [js/validation.js](file:///frontend/js/validation.js) checks:
     - `fullName`: non-empty, min 2 characters.
     - `email`: valid email regex pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
     - `mobileNumber`: strictly 10 digits regex (`/^[0-9]{10}$/`).
     - `gender`, `dateOfBirth`, `enrollmentDate`, `address`: required.
     - `courseId`: valid selected ID from dropdown.
     - `status`: Active or Inactive.
  3. **Conversion:** `JSON.stringify(studentData)` converts the JavaScript object into JSON text and sends it with the header `'Content-Type': 'application/json'`.

---

### Q3: How is the student table rendered from API response data?
- **Answer:** In `renderStudentsTable(students)` in [js/student.js](file:///frontend/js/student.js):
  - Clears `studentTableBody.innerHTML = ""`.
  - Loops over each student object in the returned array using `forEach`.
  - Creates a table row `<tr>` with sanitized HTML (`escapeHtml` prevents XSS).
  - Displays ID, Full Name, Contact info, Gender, Course name, Enrollment Date, Status badge, and Action buttons (View Details, Edit, Delete).
  - If the array is empty, it hides the table container and displays the user-friendly empty state.

---

### Q4: How are Add, Update, Delete, and Search triggered?
- **Add Student:**
  - Clicking `Register Student` opens modal, resets inputs, and fetches available courses via `populateCourseDropdown("courseId")`.
  - Form submit calls `createStudent()` with `POST /api/students`. On HTTP 201, closes modal and re-fetches student list.
- **Update Student:**
  - Clicking `Edit` on a row triggers `handleEditStudent(id)`.
  - Calls `GET /api/students/{id}` to fetch existing record, pre-fills the form inputs, loads the dropdown with current course selected, and switches mode to `PUT`.
  - Form submit calls `updateStudent(id, studentData)` with `PUT /api/students/{id}`.
- **Delete Student:**
  - Clicking `Delete` opens the Delete Confirmation Modal with student name.
  - Clicking `Confirm Delete` calls `DELETE /api/students/{id}`.
  - **Crucial Rule:** Status `204 No Content` is handled without calling `response.json()`.
- **Search Student:**
  - Typing a name and clicking `Search` (or pressing Enter) calls `searchStudentsByName(query)` (`GET /api/students/search?name=...`).
  - Renders matched results or shows empty state.
  - Clicking `Clear Search` restores the full list.

---

### Q5: How does the frontend handle HTTP errors and an empty result?
- **Answer:**
  - **Network / Server Down (500 / connection refused):** Catches errors and displays a clear retry card: *"Unable to Connect to Backend Server. Please ensure Spring Boot is running on port 8080."*
  - **Validation Error (400 Bad Request):** Parses error message from response JSON and displays warning toast and inline input validation.
  - **Duplicate Email / Course Code (409 Conflict):** Highlights the duplicate field (e.g. Email / Course Code) with `is-invalid` feedback: *"A student with this email address already exists."*
  - **Student Not Found (404 Not Found):** Shows notification that the record no longer exists.
  - **Empty Results:** Renders dedicated `.state-empty` container with informative prompt and action button.

---

## 4. How to Test Frontend Locally

1. Open any of the HTML pages in your browser:
   - `frontend/index.html` (Dashboard)
   - `frontend/students.html` (Students)
   - `frontend/courses.html` (Courses)
2. Or use any local static server (e.g. VS Code Live Server or `python -m http.server 3000`).
3. When Seshadri starts Spring Boot on `http://localhost:8080` with CORS enabled for your origin, the frontend will automatically connect and load real data from MySQL.
