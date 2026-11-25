package com.training.Student_Management.service;

import com.training.Student_Management.dto.StudentRequestDTO;
import com.training.Student_Management.dto.StudentResponseDTO;
import com.training.Student_Management.entity.Course;
import com.training.Student_Management.entity.Student;
import com.training.Student_Management.exception.DuplicateResourceException;
import com.training.Student_Management.exception.ResourceNotFoundException;
import com.training.Student_Management.repository.CourseRepository;
import com.training.Student_Management.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public StudentServiceImpl(StudentRepository studentRepository,
                              CourseRepository courseRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO requestDTO) {

        if (studentRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found"));

        Student student = new Student();

        student.setFullName(requestDTO.getFullName());
        student.setEmail(requestDTO.getEmail());
        student.setMobileNumber(requestDTO.getMobileNumber());
        student.setGender(requestDTO.getGender());
        student.setDateOfBirth(requestDTO.getDateOfBirth());
        student.setAddress(requestDTO.getAddress());
        student.setEnrollmentDate(requestDTO.getEnrollmentDate());
        student.setStatus(requestDTO.getStatus());
        student.setCourse(course);

        return mapToResponse(studentRepository.save(student));
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentById(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        return mapToResponse(student);
    }

    @Override
    public StudentResponseDTO updateStudent(Long id,
                                            StudentRequestDTO requestDTO) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        if (studentRepository.existsByEmailAndStudentIdNot(
                requestDTO.getEmail(), id)) {
            throw new DuplicateResourceException("Email already exists");
        }

        Course course = courseRepository.findById(requestDTO.getCourseId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course not found"));

        student.setFullName(requestDTO.getFullName());
        student.setEmail(requestDTO.getEmail());
        student.setMobileNumber(requestDTO.getMobileNumber());
        student.setGender(requestDTO.getGender());
        student.setDateOfBirth(requestDTO.getDateOfBirth());
        student.setAddress(requestDTO.getAddress());
        student.setEnrollmentDate(requestDTO.getEnrollmentDate());
        student.setStatus(requestDTO.getStatus());
        student.setCourse(course);

        return mapToResponse(studentRepository.save(student));
    }

    @Override
    public void deleteStudent(Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));

        studentRepository.delete(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> searchStudents(String name) {

        return studentRepository
                .findByFullNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private StudentResponseDTO mapToResponse(Student student) {

        StudentResponseDTO response = new StudentResponseDTO();

        response.setStudentId(student.getStudentId());
        response.setFullName(student.getFullName());
        response.setEmail(student.getEmail());
        response.setMobileNumber(student.getMobileNumber());
        response.setGender(student.getGender());
        response.setDateOfBirth(student.getDateOfBirth());
        response.setAddress(student.getAddress());
        response.setEnrollmentDate(student.getEnrollmentDate());
        response.setStatus(student.getStatus());
        response.setCourseId(student.getCourse().getCourseId());
        response.setCourseName(student.getCourse().getCourseName());

        return response;
    }
}
