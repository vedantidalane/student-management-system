/**
 * Student Management System - Dashboard Management
 * Author: Vedanti (Frontend Developer)
 * 
 * Fetches data from backend APIs and calculates:
 * - Total students
 * - Active students
 * - Inactive students
 * - Total courses
 * - Recently added students (latest records)
 */

document.addEventListener("DOMContentLoaded", () => {
  const dashboardContainer = document.getElementById("dashboardContent");
  if (dashboardContainer) {
    loadDashboardData();
  }
});

/**
 * Load and calculate dashboard statistics and recent student records
 */
async function loadDashboardData() {
  const loading = document.getElementById("dashboardLoadingState");
  const errorState = document.getElementById("dashboardErrorState");
  const content = document.getElementById("dashboardContent");

  if (loading) loading.classList.remove("d-none");
  if (errorState) errorState.classList.add("d-none");
  if (content) content.classList.add("d-none");

  try {
    // Parallel fetch from both endpoints
    const [studentsResponse, coursesResponse] = await Promise.all([
      fetch(CONFIG.ENDPOINTS.STUDENTS, { method: "GET", headers: CONFIG.DEFAULT_HEADERS }),
      fetch(CONFIG.ENDPOINTS.COURSES, { method: "GET", headers: CONFIG.DEFAULT_HEADERS })
    ]);

    if (!studentsResponse.ok) {
      throw new Error(`Failed to load student statistics (HTTP ${studentsResponse.status})`);
    }

    if (!coursesResponse.ok) {
      throw new Error(`Failed to load course statistics (HTTP ${coursesResponse.status})`);
    }

    const students = await studentsResponse.json();
    const courses = await coursesResponse.json();
    cachedCourses = courses;

    // Calculate metrics
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === "Active").length;
    const inactiveStudents = students.filter(s => s.status === "Inactive").length;
    const totalCourses = courses.length;

    // Update UI Cards
    updateStat("statTotalStudents", totalStudents);
    updateStat("statActiveStudents", activeStudents);
    updateStat("statInactiveStudents", inactiveStudents);
    updateStat("statTotalCourses", totalCourses);

    // Render Recent Students
    renderRecentStudents(students, courses);

    // Update connection status badge
    updateApiStatusBadge(true);

    if (loading) loading.classList.add("d-none");
    if (content) content.classList.remove("d-none");
  } catch (error) {
    console.error("Dashboard data load failed:", error);
    if (loading) loading.classList.add("d-none");
    if (errorState) {
      errorState.classList.remove("d-none");
      const errorMsg = document.getElementById("dashboardErrorMessage");
      if (errorMsg) errorMsg.textContent = error.message;
    }
    updateApiStatusBadge(false);
  }
}

/**
 * Helper to update statistic value with gentle animation
 */
function updateStat(elementId, value) {
  const elem = document.getElementById(elementId);
  if (!elem) return;
  elem.textContent = value;
}

/**
 * Render up to 5 recently enrolled students
 */
function renderRecentStudents(students, courses) {
  const tbody = document.getElementById("recentStudentsTableBody");
  const emptyState = document.getElementById("recentStudentsEmpty");
  const table = document.getElementById("recentStudentsTable");

  if (!tbody) return;
  tbody.innerHTML = "";

  if (!students || students.length === 0) {
    if (table) table.classList.add("d-none");
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (table) table.classList.remove("d-none");
  if (emptyState) emptyState.classList.add("d-none");

  // Sort descending by ID or enrollmentDate to get recently added
  const recent = [...students].sort((a, b) => {
    const idA = a.studentId || a.id || 0;
    const idB = b.studentId || b.id || 0;
    return idB - idA;
  }).slice(0, 5);

  recent.forEach(s => {
    const id = s.studentId || s.id;
    const courseName = resolveCourseName(s);
    const statusClass = s.status === "Active" ? "badge-status-active" : "badge-status-inactive";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${id}</strong></td>
      <td>
        <div class="fw-semibold">${escapeHtml(s.fullName)}</div>
        <small class="text-muted">${escapeHtml(s.email)}</small>
      </td>
      <td><span class="badge bg-light text-primary border">${escapeHtml(courseName)}</span></td>
      <td>${escapeHtml(s.enrollmentDate || "-")}</td>
      <td><span class="${statusClass}">${escapeHtml(s.status)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}
