package com.training.Student_Management.service;

import com.training.Student_Management.dto.CourseRequestDTO;
import com.training.Student_Management.dto.CourseResponseDTO;

import java.util.List;

public interface CourseService {

    CourseResponseDTO createCourse(CourseRequestDTO requestDTO);

    List<CourseResponseDTO> getAllCourses();
}