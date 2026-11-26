/**
 * Student Management System - Student Management (CRUD & Search)
 * Author: Vedanti (Frontend Developer)
 * 
 * Handles all 6 Student REST API integrations:
 * 1. POST /api/students: Create student (201)
 * 2. GET /api/students: View all students (200)
 * 3. GET /api/students/{id}: Get student by ID (200)
 * 4. PUT /api/students/{id}: Update student (200)
 * 5. DELETE /api/students/{id}: Delete student (204 No Content)
 * 6. GET /api/students/search?name=...: Search student by name (200)
 */

let allStudents = [];
let studentToDeleteId = null;

/**
 * Fetch all students from backend
 * Endpoint: GET /api/students
 */
async function fetchAllStudents() {
  try {
    const response = await fetch(CONFIG.ENDPOINTS.STUDENTS, {
      method: "GET",
      headers: CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`Failed to load students (HTTP ${response.status})`);
    }

    const students = await response.json();
    allStudents = students;
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

/**
 * Fetch a single student by ID
 * Endpoint: GET /api/students/{id}
 */
async function fetchStudentById(studentId) {
  try {
    const response = await fetch(`${CONFIG.ENDPOINTS.STUDENTS}/${studentId}`, {
      method: "GET",
      headers: CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`Student not found with ID ${studentId} (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching student #${studentId}:`, error);
    throw error;
  }
}

/**
 * Search students by full name
 * Endpoint: GET /api/students/search?name={name}
 */
async function searchStudentsByName(name) {
  try {
    const url = `${CONFIG.ENDPOINTS.STUDENT_SEARCH}?name=${encodeURIComponent(name)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`Search failed (HTTP ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching students:", error);
    throw error;
  }
}

/**
 * Create a new student
 * Endpoint: POST /api/students
 */
async function createStudent(studentData) {
  try {
    const response = await fetch(CONFIG.ENDPOINTS.STUDENTS, {
      method: "POST",
      headers: CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(studentData)
    });

    if (response.status === 201) {
      const createdStudent = await response.json();
      return { success: true, data: createdStudent };
    }

    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error || errorBody?.message || `Failed to create student (HTTP ${response.status})`;
    return {
      success: false,
      status: response.status,
      message: message,
      fieldErrors: errorBody?.messages || null
    };
  } catch (error) {
    console.error("Error creating student:", error);
    return { success: false, message: error.message || "Network error while creating student." };
  }
}

/**
 * Update an existing student
 * Endpoint: PUT /api/students/{id}
 */
async function updateStudent(studentId, studentData) {
  try {
    const response = await fetch(`${CONFIG.ENDPOINTS.STUDENTS}/${studentId}`, {
      method: "PUT",
      headers: CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(studentData)
    });

    if (response.ok) {
      const updatedStudent = await response.json().catch(() => null);
      return { success: true, data: updatedStudent };
    }

    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error || errorBody?.message || `Failed to update student (HTTP ${response.status})`;
    return {
      success: false,
      status: response.status,
      message: message,
      fieldErrors: errorBody?.messages || null
    };
  } catch (error) {
    console.error(`Error updating student #${studentId}:`, error);
    return { success: false, message: error.message || "Network error while updating student." };
  }
}

/**
 * Delete a student
 * Endpoint: DELETE /api/students/{id}
 * IMPORTANT: SRS Section 9.3 requires handling 204 No Content without calling response.json()
 */
async function deleteStudent(studentId) {
  try {
    const response = await fetch(`${CONFIG.ENDPOINTS.STUDENTS}/${studentId}`, {
      method: "DELETE",
      headers: CONFIG.DEFAULT_HEADERS
    });

    // 204 No Content or 200 OK means successful deletion
    if (response.status === 204 || response.ok) {
      return { success: true };
    }

    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || errorBody?.error || `Failed to delete student (HTTP ${response.status})`;
    return { success: false, status: response.status, message: message };
  } catch (error) {
    console.error(`Error deleting student #${studentId}:`, error);
    return { success: false, message: error.message || "Network error while deleting student." };
  }
}

/**
 * Render students into the table body
 */
function renderStudentsTable(students) {
  const tbody = document.getElementById("studentTableBody");
  const emptyState = document.getElementById("studentEmptyState");
  const tableContainer = document.getElementById("studentTableContainer");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!students || students.length === 0) {
    if (tableContainer) tableContainer.classList.add("d-none");
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (tableContainer) tableContainer.classList.remove("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  students.forEach(s => {
    const id = s.studentId || s.id;
    const statusClass = s.status === "Active" ? "badge-status-active" : "badge-status-inactive";
    const courseTitle = resolveCourseName(s);

    const tr = document.createElement("tr");
    tr.id = `student-row-${id}`;
    tr.innerHTML = `
      <td><strong>#${id}</strong></td>
      <td>
        <div class="fw-bold text-dark">${escapeHtml(s.fullName)}</div>
        <small class="text-muted"><i class="bi bi-geo-alt"></i> ${escapeHtml(s.address || "-")}</small>
      </td>
      <td>
        <div><i class="bi bi-envelope text-muted me-1"></i>${escapeHtml(s.email)}</div>
        <small class="text-muted"><i class="bi bi-telephone me-1"></i>${escapeHtml(s.mobileNumber || "-")}</small>
      </td>
      <td><span class="badge bg-light text-dark border">${escapeHtml(s.gender || "-")}</span></td>
      <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">${escapeHtml(courseTitle)}</span></td>
      <td>${escapeHtml(s.enrollmentDate || "-")}</td>
      <td><span class="${statusClass}">${escapeHtml(s.status)}</span></td>
      <td>
        <div class="btn-action-group">
          <button class="btn btn-outline-info btn-action" title="View Details" onclick="handleViewStudent(${id})">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-outline-primary btn-action" title="Edit Student" onclick="handleEditStudent(${id})">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-outline-danger btn-action" title="Delete Student" onclick="openDeleteModal(${id}, '${escapeHtml(s.fullName)}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Load students page data
 */
async function loadStudentsPage() {
  const loading = document.getElementById("studentLoadingState");
  const error = document.getElementById("studentErrorState");
  const tableContainer = document.getElementById("studentTableContainer");
  const emptyState = document.getElementById("studentEmptyState");
  const totalBadge = document.getElementById("totalStudentsBadge");

  if (loading) loading.classList.remove("d-none");
  if (error) error.classList.add("d-none");
  if (tableContainer) tableContainer.classList.add("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  try {
    // Also load courses cache if not already loaded so course names resolve properly
    if (cachedCourses.length === 0) {
      await fetchCourses().catch(() => []);
    }

    const students = await fetchAllStudents();
    if (loading) loading.classList.add("d-none");

    if (totalBadge) {
      totalBadge.textContent = `${students.length} Student${students.length === 1 ? '' : 's'}`;
    }

    updateApiStatusBadge(true);
    renderStudentsTable(students);
  } catch (err) {
    if (loading) loading.classList.add("d-none");
    updateApiStatusBadge(false);
    if (error) {
      error.classList.remove("d-none");
      const errorMsg = document.getElementById("studentErrorMessage");
      if (errorMsg) errorMsg.textContent = err.message;
    }
  }
}

/**
 * Open Modal to Add a New Student
 */
async function openAddStudentModal() {
  const form = document.getElementById("studentForm");
  const modalTitle = document.getElementById("studentModalTitle");
  const studentIdInput = document.getElementById("studentId");
  const modalSubmitBtn = document.getElementById("saveStudentBtn");

  if (form) {
    form.reset();
    clearFormValidation(form);
  }

  if (modalTitle) modalTitle.innerHTML = `<i class="bi bi-person-plus me-2 text-primary"></i>Add New Student`;
  if (studentIdInput) studentIdInput.value = "";
  if (modalSubmitBtn) modalSubmitBtn.textContent = "Save Student";

  // Set default enrollment date to today
  const enrollmentDateInput = document.getElementById("enrollmentDate");
  if (enrollmentDateInput && !enrollmentDateInput.value) {
    enrollmentDateInput.value = new Date().toISOString().split("T")[0];
  }

  // Populate course dropdown
  await populateCourseDropdown("courseId");

  const modalElem = document.getElementById("studentModal");
  if (modalElem) {
    const modal = new bootstrap.Modal(modalElem);
    modal.show();
  }
}

/**
 * Handle Edit Student Button Click
 * Fetches student by ID and pre-fills form
 */
async function handleEditStudent(studentId) {
  try {
    const student = await fetchStudentById(studentId);
    const form = document.getElementById("studentForm");
    const modalTitle = document.getElementById("studentModalTitle");
    const studentIdInput = document.getElementById("studentId");
    const modalSubmitBtn = document.getElementById("saveStudentBtn");

    if (form) clearFormValidation(form);

    if (modalTitle) modalTitle.innerHTML = `<i class="bi bi-pencil-square me-2 text-primary"></i>Edit Student Details`;
    if (studentIdInput) studentIdInput.value = student.studentId || student.id;
    if (modalSubmitBtn) modalSubmitBtn.textContent = "Update Student";

    // Fill form fields
    document.getElementById("fullName").value = student.fullName || "";
    document.getElementById("email").value = student.email || "";
    document.getElementById("mobileNumber").value = student.mobileNumber || "";
    document.getElementById("gender").value = student.gender || "";
    document.getElementById("dateOfBirth").value = student.dateOfBirth || "";
    document.getElementById("address").value = student.address || "";
    document.getElementById("enrollmentDate").value = student.enrollmentDate || "";
    document.getElementById("studentStatus").value = student.status || "Active";

    // Populate course dropdown with selected course
    const courseId = student.courseId || (student.course ? (student.course.courseId || student.course.id) : null);
    await populateCourseDropdown("courseId", courseId);

    const modalElem = document.getElementById("studentModal");
    if (modalElem) {
      const modal = new bootstrap.Modal(modalElem);
      modal.show();
    }
  } catch (error) {
    showToast(`Could not load student details: ${error.message}`, "danger");
  }
}

/**
 * Handle Student Form Submission (Add or Update)
 */
async function handleStudentFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const studentId = document.getElementById("studentId").value;
  const isEditing = Boolean(studentId);

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobileNumber");
  const genderInput = document.getElementById("gender");
  const dobInput = document.getElementById("dateOfBirth");
  const addressInput = document.getElementById("address");
  const enrollInput = document.getElementById("enrollmentDate");
  const statusInput = document.getElementById("studentStatus");
  const courseInput = document.getElementById("courseId");
  const submitBtn = document.getElementById("saveStudentBtn");

  clearFormValidation(form);

  const studentData = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    mobileNumber: mobileInput.value.trim(),
    gender: genderInput.value,
    dateOfBirth: dobInput.value,
    address: addressInput.value.trim(),
    enrollmentDate: enrollInput.value,
    status: statusInput.value,
    courseId: Number(courseInput.value)
  };

  const validation = validateStudentForm(studentData);
  if (!validation.isValid) {
    Object.keys(validation.errors).forEach(field => {
      let input = document.getElementById(field);
      if (field === "status") input = statusInput;
      setFieldInvalid(input, validation.errors[field]);
    });
    showToast("Please fix the validation errors in the form.", "warning");
    return;
  }

  // Button loading state
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Saving...`;

  let result;
  if (isEditing) {
    result = await updateStudent(studentId, studentData);
  } else {
    result = await createStudent(studentData);
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;

  if (result.success) {
    showToast(isEditing ? "Student updated successfully!" : "Student registered successfully!", "success");
    form.reset();
    clearFormValidation(form);

    const modalElem = document.getElementById("studentModal");
    if (modalElem) {
      const modal = bootstrap.Modal.getInstance(modalElem);
      if (modal) modal.hide();
    }

    // Refresh table with latest data from backend
    loadStudentsPage();
  } else {
    showToast(`Error: ${result.message}`, "danger");
    if (result.fieldErrors && typeof result.fieldErrors === "object") {
      Object.entries(result.fieldErrors).forEach(([field, msg]) => {
        let input = document.getElementById(field);
        if (field === "status") input = statusInput;
        if (input) setFieldInvalid(input, msg);
      });
    } else if (result.status === 409) {
      setFieldInvalid(emailInput, "A student with this email address already exists.");
    }
  }
}

/**
 * Handle View Student Details Modal
 */
async function handleViewStudent(studentId) {
  try {
    const s = await fetchStudentById(studentId);
    const viewBody = document.getElementById("viewStudentDetailsBody");
    if (!viewBody) return;

    const courseName = resolveCourseName(s);
    const statusBadge = s.status === "Active" ? "badge-status-active" : "badge-status-inactive";

    viewBody.innerHTML = `
      <div class="row g-3">
        <div class="col-12 text-center pb-2 border-bottom">
          <div class="avatar-placeholder rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-2" style="width: 64px; height: 64px; font-size: 1.75rem;">
            ${escapeHtml(s.fullName ? s.fullName.charAt(0).toUpperCase() : "S")}
          </div>
          <h5 class="mb-0 fw-bold">${escapeHtml(s.fullName)}</h5>
          <span class="${statusBadge} mt-1">${escapeHtml(s.status)}</span>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Student ID</label>
          <div class="fw-semibold">#${s.studentId || s.id}</div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Enrolled Course</label>
          <div class="fw-semibold text-primary">${escapeHtml(courseName)}</div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Email Address</label>
          <div><a href="mailto:${escapeHtml(s.email)}">${escapeHtml(s.email)}</a></div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Mobile Number</label>
          <div>${escapeHtml(s.mobileNumber || "N/A")}</div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Gender</label>
          <div>${escapeHtml(s.gender || "N/A")}</div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Date of Birth</label>
          <div>${escapeHtml(s.dateOfBirth || "N/A")}</div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Enrollment Date</label>
          <div>${escapeHtml(s.enrollmentDate || "N/A")}</div>
        </div>
        <div class="col-sm-6">
          <label class="text-muted small">Address</label>
          <div>${escapeHtml(s.address || "N/A")}</div>
        </div>
      </div>
    `;

    const modalElem = document.getElementById("viewStudentModal");
    if (modalElem) {
      const modal = new bootstrap.Modal(modalElem);
      modal.show();
    }
  } catch (error) {
    showToast(`Could not load details: ${error.message}`, "danger");
  }
}

/**
 * Open Delete Confirmation Modal
 */
function openDeleteModal(studentId, studentName) {
  studentToDeleteId = studentId;
  const nameSpan = document.getElementById("deleteStudentName");
  if (nameSpan) nameSpan.textContent = studentName;

  const modalElem = document.getElementById("deleteConfirmModal");
  if (modalElem) {
    const modal = new bootstrap.Modal(modalElem);
    modal.show();
  }
}

/**
 * Confirm and trigger Student Deletion
 */
async function confirmDeleteStudent() {
  if (!studentToDeleteId) return;

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const originalText = confirmBtn.innerHTML;
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Deleting...`;

  const result = await deleteStudent(studentToDeleteId);

  confirmBtn.disabled = false;
  confirmBtn.innerHTML = originalText;

  const modalElem = document.getElementById("deleteConfirmModal");
  if (modalElem) {
    const modal = bootstrap.Modal.getInstance(modalElem);
    if (modal) modal.hide();
  }

  if (result.success) {
    showToast("Student deleted successfully!", "success");
    studentToDeleteId = null;
    loadStudentsPage();
  } else {
    showToast(`Error deleting student: ${result.message}`, "danger");
  }
}

/**
 * Handle Search Input / Button
 */
async function handleSearch() {
  const searchInput = document.getElementById("studentSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  const query = searchInput ? searchInput.value.trim() : "";

  if (!query) {
    if (clearBtn) clearBtn.classList.add("d-none");
    loadStudentsPage();
    return;
  }

  if (clearBtn) clearBtn.classList.remove("d-none");

  const loading = document.getElementById("studentLoadingState");
  const tableContainer = document.getElementById("studentTableContainer");
  const emptyState = document.getElementById("studentEmptyState");

  if (loading) loading.classList.remove("d-none");
  if (tableContainer) tableContainer.classList.add("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  try {
    const searchResults = await searchStudentsByName(query);
    if (loading) loading.classList.add("d-none");

    const totalBadge = document.getElementById("totalStudentsBadge");
    if (totalBadge) {
      totalBadge.textContent = `${searchResults.length} Result${searchResults.length === 1 ? '' : 's'}`;
    }

    renderStudentsTable(searchResults);
  } catch (error) {
    if (loading) loading.classList.add("d-none");
    showToast(`Search failed: ${error.message}`, "danger");
  }
}

function clearSearch() {
  const searchInput = document.getElementById("studentSearchInput");
  const clearBtn = document.getElementById("clearSearchBtn");
  if (searchInput) searchInput.value = "";
  if (clearBtn) clearBtn.classList.add("d-none");
  loadStudentsPage();
}

/**
 * Initialize Event Listeners on DOM Loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  const studentTableBody = document.getElementById("studentTableBody");
  const studentForm = document.getElementById("studentForm");
  const addStudentBtn = document.getElementById("addStudentBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("studentSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  if (studentTableBody) {
    loadStudentsPage();
  }

  if (studentForm) {
    studentForm.addEventListener("submit", handleStudentFormSubmit);
  }

  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", openAddStudentModal);
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", confirmDeleteStudent);
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", clearSearch);
  }
});
