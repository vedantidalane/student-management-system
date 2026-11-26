/**
 * Student Management System - API Configuration
 * Author: Vedanti (Frontend Developer)
 * 
 * Centralized API base URL and reusable endpoint paths.
 * Configured according to SRS Section 3, 7.4 & Step 3.
 */

const API_BASE_URL = "http://localhost:8080/api";
const CONFIG = {
  // Change this once to the deployed backend URL when publishing the frontend.
  BASE_URL: API_BASE_URL,

  // Specific API Endpoints
  ENDPOINTS: {
    // Student Endpoints
    STUDENTS: `${API_BASE_URL}/students`,
    STUDENT_SEARCH: `${API_BASE_URL}/students/search`,
    
    // Course Endpoints
    COURSES: `${API_BASE_URL}/courses`
  },

  // HTTP Request Helper Settings
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};

// Freeze config object to prevent accidental runtime mutations
Object.freeze(CONFIG);
Object.freeze(CONFIG.ENDPOINTS);
Object.freeze(CONFIG.DEFAULT_HEADERS);
