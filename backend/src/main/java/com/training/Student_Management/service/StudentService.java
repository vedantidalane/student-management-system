package com.training.Student_Management.service;

import com.training.Student_Management.dto.StudentRequestDTO;
import com.training.Student_Management.dto.StudentResponseDTO;

import java.util.List;

public interface StudentService {

    StudentResponseDTO createStudent(StudentRequestDTO requestDTO);

    List<StudentResponseDTO> getAllStudents();

    StudentResponseDTO getStudentById(Long id);

    StudentResponseDTO updateStudent(Long id, StudentRequestDTO requestDTO);

    void deleteStudent(Long id);

    List<StudentResponseDTO> searchStudents(String name);
}