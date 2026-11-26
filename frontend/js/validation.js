/**
 * Student Management System - Validation & UI Notifications
 * Author: Vedanti (Frontend Developer)
 * 
 * Implements client-side validation rules specified in SRS Section 6 & 10:
 * - Full Name: Required, reject whitespace-only.
 * - Email: Required, valid email pattern.
 * - Mobile Number: Required, exactly 10 digits.
 * - Gender: Required.
 * - Date of Birth: Required, valid past date.
 * - Address: Required.
 * - Enrollment Date: Required, valid date.
 * - Status: Active or Inactive.
 * - Course: Valid course selection.
 */

// Global Toast Notification Helper
function showToast(message, type = "info", duration = 4000) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container-custom";
    document.body.appendChild(container);
  }

  const iconMap = {
    success: "bi-check-circle-fill",
    danger: "bi-exclamation-triangle-fill",
    warning: "bi-exclamation-circle-fill",
    info: "bi-info-circle-fill"
  };

  const toast = document.createElement("div");
  toast.className = `toast-custom toast-${type}`;
  toast.innerHTML = `
    <i class="bi ${iconMap[type] || iconMap.info} toast-icon"></i>
    <div class="toast-body-text">${escapeHtml(message)}</div>
    <button type="button" class="toast-close-btn" aria-label="Close">&times;</button>
  `;

  const closeBtn = toast.querySelector(".toast-close-btn");
  closeBtn.addEventListener("click", () => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(50px)";
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }
}

// Utility to escape HTML to prevent XSS
function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Field validation feedback helpers
function setFieldInvalid(inputElement, errorMessage) {
  if (!inputElement) return;
  inputElement.classList.add("is-invalid");
  inputElement.classList.remove("is-valid");

  let feedback = inputElement.parentElement.querySelector(".invalid-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.className = "invalid-feedback";
    inputElement.parentElement.appendChild(feedback);
  }
  feedback.textContent = errorMessage;
}

function setFieldValid(inputElement) {
  if (!inputElement) return;
  inputElement.classList.remove("is-invalid");
  inputElement.classList.add("is-valid");

  const feedback = inputElement.parentElement.querySelector(".invalid-feedback");
  if (feedback) {
    feedback.textContent = "";
  }
}

function resetValidation(inputElement) {
  if (!inputElement) return;
  inputElement.classList.remove("is-invalid", "is-valid");
  const feedback = inputElement.parentElement.querySelector(".invalid-feedback");
  if (feedback) {
    feedback.textContent = "";
  }
}

function clearFormValidation(formElement) {
  if (!formElement) return;
  const inputs = formElement.querySelectorAll(".form-control, .form-select");
  inputs.forEach(input => resetValidation(input));
}

// Validation Logic for Student Form
function validateStudentForm(formData) {
  const errors = {};

  // 1. Full Name: Required, reject whitespace-only
  if (!formData.fullName || formData.fullName.trim().length === 0) {
    errors.fullName = "Full name is required and cannot be blank.";
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = "Full name must be at least 2 characters long.";
  }

  // 2. Email: Required, valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || formData.email.trim().length === 0) {
    errors.email = "Email address is required.";
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = "Please enter a valid email address (e.g., student@example.com).";
  }

  // 3. Mobile Number: Required, exactly 10 digits
  const mobileRegex = /^[0-9]{10}$/;
  if (!formData.mobileNumber || formData.mobileNumber.trim().length === 0) {
    errors.mobileNumber = "Mobile number is required.";
  } else if (!mobileRegex.test(formData.mobileNumber.trim())) {
    errors.mobileNumber = "Mobile number must be exactly 10 numeric digits.";
  }

  // 4. Gender: Required
  if (!formData.gender || formData.gender.trim().length === 0) {
    errors.gender = "Please select a gender.";
  }

  // 5. Date of Birth: Required, valid past date
  if (!formData.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = "Please enter a valid date.";
    } else if (dob >= today) {
      errors.dateOfBirth = "Date of birth must be in the past.";
    }
  }

  // 6. Address: Required
  if (!formData.address || formData.address.trim().length === 0) {
    errors.address = "Address is required.";
  }

  // 7. Enrollment Date: Required, valid date
  if (!formData.enrollmentDate) {
    errors.enrollmentDate = "Enrollment date is required.";
  } else {
    const enrollDate = new Date(formData.enrollmentDate);
    if (isNaN(enrollDate.getTime())) {
      errors.enrollmentDate = "Please enter a valid enrollment date.";
    }
  }

  // 8. Status: Active or Inactive
  if (!formData.status || (formData.status !== "Active" && formData.status !== "Inactive")) {
    errors.status = "Please select either Active or Inactive status.";
  }

  // 9. Course ID: Required, must refer to an existing course
  if (!formData.courseId || isNaN(Number(formData.courseId)) || Number(formData.courseId) <= 0) {
    errors.courseId = "Please select a valid course from the list.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
}

// Validation Logic for Course Form
function validateCourseForm(formData) {
  const errors = {};

  // 1. Course Name: Required
  if (!formData.courseName || formData.courseName.trim().length === 0) {
    errors.courseName = "Course name is required.";
  }

  // 2. Course Code: Required and unique
  if (!formData.courseCode || formData.courseCode.trim().length === 0) {
    errors.courseCode = "Course code is required (e.g., JFS101).";
  }

  // 3. Duration: Required
  if (!formData.duration || formData.duration.trim().length === 0) {
    errors.duration = "Course duration is required (e.g., 6 Months).";
  }

  // 4. Status: Active or Inactive
  if (!formData.status || (formData.status !== "Active" && formData.status !== "Inactive")) {
    errors.status = "Please select either Active or Inactive status.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
}


/**
 * Shared Helper: Update Backend API Connection Indicator Badge
 */
function updateApiStatusBadge(isConnected) {
  const badge = document.getElementById("apiStatusBadge");
  if (!badge) return;

  if (isConnected) {
    badge.className = "badge bg-success badge-api-status";
    badge.innerHTML = `<i class="bi bi-cloud-check-fill me-1"></i>Backend Connected`;
  } else {
    badge.className = "badge bg-danger badge-api-status";
    badge.innerHTML = `<i class="bi bi-cloud-slash-fill me-1"></i>Backend Offline`;
  }
}
