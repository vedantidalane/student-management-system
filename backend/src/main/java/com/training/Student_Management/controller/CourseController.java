package com.training.Student_Management.controller;

import com.training.Student_Management.dto.CourseRequestDTO;
import com.training.Student_Management.dto.CourseResponseDTO;
import com.training.Student_Management.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<CourseResponseDTO> createCourse(
            @Valid @RequestBody CourseRequestDTO requestDTO) {

        return new ResponseEntity<>(
                courseService.createCourse(requestDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses() {

        return ResponseEntity.ok(courseService.getAllCourses());
    }
}