package com.training.Student_Management.repository;

import com.training.Student_Management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository
        extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndStudentIdNot(
            String email,
            Long studentId
    );

    List<Student> findByFullNameContainingIgnoreCase(String name);
}
