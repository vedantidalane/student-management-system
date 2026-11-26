-- =============================================================================
-- Database Name: student_management
-- Project: Student Management System
-- Developers: Vedanti (Frontend) & Seshadri (Backend)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS student_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_management;

-- -----------------------------------------------------------------------------
-- Table: courses
-- Mapped to: com.training.Student_Management.entity.Course
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
    course_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(30) NOT NULL UNIQUE,
    duration VARCHAR(50) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    status VARCHAR(20) NOT NULL,
    INDEX idx_course_code (course_code),
    INDEX idx_course_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table: students
-- Mapped to: com.training.Student_Management.entity.Student
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    mobile_number VARCHAR(15) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    enrollment_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    course_id BIGINT NOT NULL,
    CONSTRAINT fk_students_course FOREIGN KEY (course_id)
        REFERENCES courses (course_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    INDEX idx_student_email (email),
    INDEX idx_student_name (full_name),
    INDEX idx_student_course (course_id),
    INDEX idx_student_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Sample Seed Data for Courses (Enables immediate frontend course dropdown loading)
-- -----------------------------------------------------------------------------
INSERT INTO courses (course_id, course_name, course_code, duration, description, status)
VALUES
    (1, 'Java Full Stack Development', 'JFS101', '6 Months', 'Comprehensive Java, Spring Boot, JPA, MySQL and Modern Frontend development.', 'Active'),
    (2, 'Python Data Science & AI', 'PDS201', '6 Months', 'Python programming, Data Analysis, Machine Learning, and API services.', 'Active'),
    (3, 'Cloud Computing & DevOps', 'CDE301', '4 Months', 'Docker, Kubernetes, CI/CD pipelines, and Cloud infrastructure.', 'Active'),
    (4, 'Frontend Web Development', 'FED102', '3 Months', 'Modern responsive web development with HTML5, CSS3, JavaScript ES6 and Bootstrap.', 'Active')
ON DUPLICATE KEY UPDATE course_name = VALUES(course_name);

-- -----------------------------------------------------------------------------
-- Sample Seed Data for Students
-- -----------------------------------------------------------------------------
INSERT INTO students (student_id, full_name, email, mobile_number, gender, date_of_birth, address, enrollment_date, status, course_id)
VALUES
    (1, 'Rahul Patil', 'rahul.patil@example.com', '9876543210', 'Male', '2003-05-15', 'Pune, Maharashtra', '2026-11-20', 'Active', 1),
    (2, 'Priya Sharma', 'priya.sharma@example.com', '9812345678', 'Female', '2002-08-22', 'Mumbai, Maharashtra', '2026-11-22', 'Active', 2)
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);
