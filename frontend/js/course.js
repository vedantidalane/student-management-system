/**
 * Student Management System - Course Management
 * Author: Vedanti (Frontend Developer)
 * 
 * Handles all Course API interactions:
 * - GET /api/courses: Fetch all available courses
 * - POST /api/courses: Add a new course
 * - Populating course dropdown in student forms
 * - Rendering course list table on courses.html
 */

// Cache of fetched courses
let cachedCourses = [];

/**
 * Resolve displayable course name for a student record
 */
function resolveCourseName(student) {
  if (student.course && typeof student.course === "object" && student.course.courseName) {
    return student.course.courseName;
  }
  if (student.courseName) {
    return student.courseName;
  }
  if (cachedCourses && cachedCourses.length > 0) {
    const found = cachedCourses.find(c => String(c.courseId || c.id) === String(student.courseId));
    if (found) return found.courseName;
  }
  return student.courseId ? `Course #${student.courseId}` : "Not Assigned";
}

/**
 * Fetch all courses from the backend API
 * Endpoint: GET /api/courses
 */
async function fetchCourses() {
  try {
    const response = await fetch(CONFIG.ENDPOINTS.COURSES, {
      method: "GET",
      headers: CONFIG.DEFAULT_HEADERS
    });

    if (!response.ok) {
      throw new Error(`Failed to load courses (HTTP ${response.status})`);
    }

    const courses = await response.json();
    cachedCourses = courses;
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

/**
 * Create a new course via backend API
 * Endpoint: POST /api/courses
 */
async function createCourse(courseData) {
  try {
    const response = await fetch(CONFIG.ENDPOINTS.COURSES, {
      method: "POST",
      headers: CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(courseData)
    });

    if (response.status === 201) {
      const createdCourse = await response.json();
      return { success: true, data: createdCourse };
    }

    // Handle error statuses (400 validation, 409 duplicate courseCode, 500 server error)
    const errorBody = await response.json().catch(() => null);
    const errorMessage = errorBody?.error || errorBody?.message || `Failed to create course (HTTP ${response.status})`;
    return {
      success: false,
      status: response.status,
      message: errorMessage,
      fieldErrors: errorBody?.messages || null
    };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, message: error.message || "Network error. Please ensure backend is running." };
  }
}

/**
 * Populate any <select> element with courses from the backend
 * Step 8 in SRS Integration Process
 */
async function populateCourseDropdown(selectElementId, selectedCourseId = null) {
  const selectElem = document.getElementById(selectElementId);
  if (!selectElem) return;

  selectElem.innerHTML = `<option value="">-- Loading courses... --</option>`;
  selectElem.disabled = true;

  try {
    const courses = await fetchCourses();
    selectElem.innerHTML = `<option value="">-- Select Course --</option>`;

    if (!courses || courses.length === 0) {
      selectElem.innerHTML = `<option value="">No courses available (Add a course first)</option>`;
      return;
    }

    courses.forEach(course => {
      // If course is Active, or it is the currently selected course of this student
      const id = course.courseId || course.id;
      const isSelected = selectedCourseId && String(id) === String(selectedCourseId);
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${course.courseName} (${course.courseCode || "N/A"})`;
      if (isSelected) option.selected = true;
      selectElem.appendChild(option);
    });

    selectElem.disabled = false;
  } catch (error) {
    selectElem.innerHTML = `<option value="">Error loading courses from server</option>`;
    console.error("Could not populate course dropdown:", error);
  }
}

/**
 * Render the course table on courses.html
 */
function renderCoursesTable(courses) {
  const tbody = document.getElementById("courseTableBody");
  const emptyState = document.getElementById("courseEmptyState");
  const tableContainer = document.getElementById("courseTableContainer");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!courses || courses.length === 0) {
    if (tableContainer) tableContainer.classList.add("d-none");
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (tableContainer) tableContainer.classList.remove("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  courses.forEach((c, index) => {
    const tr = document.createElement("tr");
    const statusClass = c.status === "Active" ? "badge-status-active" : "badge-status-inactive";

    tr.innerHTML = `
      <td><strong>#${c.courseId || c.id || index + 1}</strong></td>
      <td>
        <span class="fw-bold text-primary">${escapeHtml(c.courseName)}</span>
      </td>
      <td><span class="badge bg-secondary font-monospace">${escapeHtml(c.courseCode)}</span></td>
      <td><i class="bi bi-clock me-1 text-muted"></i>${escapeHtml(c.duration || "N/A")}</td>
      <td><small class="text-muted">${escapeHtml(c.description || "-")}</small></td>
      <td><span class="${statusClass}">${escapeHtml(c.status)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Initialize Course page behaviors if on courses.html
 */
document.addEventListener("DOMContentLoaded", () => {
  const courseTableBody = document.getElementById("courseTableBody");
  const courseForm = document.getElementById("courseForm");

  // Only run if on courses.html
  if (courseTableBody) {
    loadCoursesPage();
  }

  if (courseForm) {
    courseForm.addEventListener("submit", handleCourseFormSubmit);
  }
});

/**
 * Load courses list and handle UI states
 */
async function loadCoursesPage() {
  const loadingIndicator = document.getElementById("courseLoadingState");
  const errorIndicator = document.getElementById("courseErrorState");
  const tableContainer = document.getElementById("courseTableContainer");
  const emptyState = document.getElementById("courseEmptyState");
  const totalCoursesBadge = document.getElementById("totalCoursesBadge");

  if (loadingIndicator) loadingIndicator.classList.remove("d-none");
  if (errorIndicator) errorIndicator.classList.add("d-none");
  if (tableContainer) tableContainer.classList.add("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  try {
    const courses = await fetchCourses();
    if (loadingIndicator) loadingIndicator.classList.add("d-none");

    if (totalCoursesBadge) {
      totalCoursesBadge.textContent = `${courses.length} Course${courses.length === 1 ? '' : 's'}`;
    }

    updateApiStatusBadge(true);
    renderCoursesTable(courses);
  } catch (error) {
    if (loadingIndicator) loadingIndicator.classList.add("d-none");
    updateApiStatusBadge(false);
    if (errorIndicator) {
      errorIndicator.classList.remove("d-none");
      const errorMsg = document.getElementById("courseErrorMessage");
      if (errorMsg) errorMsg.textContent = error.message;
    }
  }
}

/**
 * Handle Add Course Form Submission
 */
async function handleCourseFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const courseNameInput = document.getElementById("courseName");
  const courseCodeInput = document.getElementById("courseCode");
  const durationInput = document.getElementById("duration");
  const descriptionInput = document.getElementById("description");
  const statusInput = document.getElementById("courseStatus");
  const submitBtn = document.getElementById("saveCourseBtn");

  clearFormValidation(form);

  const courseData = {
    courseName: courseNameInput.value.trim(),
    courseCode: courseCodeInput.value.trim().toUpperCase(),
    duration: durationInput.value.trim(),
    description: descriptionInput.value.trim(),
    status: statusInput.value
  };

  const validation = validateCourseForm(courseData);
  if (!validation.isValid) {
    Object.keys(validation.errors).forEach(field => {
      const input = document.getElementById(field === "status" ? "courseStatus" : field);
      setFieldInvalid(input, validation.errors[field]);
    });
    showToast("Please fill all required course fields correctly.", "warning");
    return;
  }

  // Disable button and show spinner
  const originalBtnText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> Saving...`;

  const result = await createCourse(courseData);

  submitBtn.disabled = false;
  submitBtn.innerHTML = originalBtnText;

  if (result.success) {
    showToast("Course created successfully!", "success");
    form.reset();
    clearFormValidation(form);

    // Close Bootstrap Modal if open
    const modalElem = document.getElementById("addCourseModal");
    if (modalElem) {
      const modal = bootstrap.Modal.getInstance(modalElem);
      if (modal) modal.hide();
    }

    // Refresh courses list
    loadCoursesPage();
  } else {
    showToast(`Error: ${result.message}`, "danger");
    if (result.fieldErrors && typeof result.fieldErrors === "object") {
      Object.entries(result.fieldErrors).forEach(([field, msg]) => {
        const input = document.getElementById(field === "status" ? "courseStatus" : field);
        if (input) setFieldInvalid(input, msg);
      });
    } else if (result.status === 409) {
      setFieldInvalid(courseCodeInput, "A course with this code already exists.");
    }
  }
}
