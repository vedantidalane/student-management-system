package com.training.Student_Management.service;

import com.training.Student_Management.dto.CourseRequestDTO;
import com.training.Student_Management.dto.CourseResponseDTO;
import com.training.Student_Management.entity.Course;
import com.training.Student_Management.exception.DuplicateResourceException;
import com.training.Student_Management.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public CourseResponseDTO createCourse(CourseRequestDTO requestDTO) {

        if (courseRepository.existsByCourseCode(requestDTO.getCourseCode())) {
            throw new DuplicateResourceException("Course code already exists");
        }

        Course course = new Course();

        course.setCourseName(requestDTO.getCourseName());
        course.setCourseCode(requestDTO.getCourseCode());
        course.setDuration(requestDTO.getDuration());
        course.setDescription(requestDTO.getDescription());
        course.setStatus(requestDTO.getStatus());

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDTO> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CourseResponseDTO mapToResponse(Course course) {

        CourseResponseDTO response = new CourseResponseDTO();

        response.setCourseId(course.getCourseId());
        response.setCourseName(course.getCourseName());
        response.setCourseCode(course.getCourseCode());
        response.setDuration(course.getDuration());
        response.setDescription(course.getDescription());
        response.setStatus(course.getStatus());

        return response;
    }
}
