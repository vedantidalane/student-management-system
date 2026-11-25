package com.training.Student_Management.controller;

import com.training.Student_Management.dto.StudentRequestDTO;
import com.training.Student_Management.dto.StudentResponseDTO;
import com.training.Student_Management.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(
            @Valid @RequestBody StudentRequestDTO requestDTO) {

        return new ResponseEntity<>(
                studentService.createStudent(requestDTO),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {

        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDTO requestDTO) {

        return ResponseEntity.ok(
                studentService.updateStudent(id, requestDTO)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponseDTO>> searchStudents(
            @RequestParam String name) {

        return ResponseEntity.ok(studentService.searchStudents(name));
    }
}