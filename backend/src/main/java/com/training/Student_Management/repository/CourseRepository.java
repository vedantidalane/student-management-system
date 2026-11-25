package com.training.Student_Management.repository;

import com.training.Student_Management.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    boolean existsByCourseCode(String courseCode);

}