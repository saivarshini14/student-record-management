package com.example.studentmanagement.repository;

import com.example.studentmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCase(String rollNumber);

    boolean existsByRollNumberIgnoreCaseAndIdNot(String rollNumber, Long id);

    List<Student> findByRollNumberContainingIgnoreCase(String rollNumber);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.branch) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY s.id DESC")
    List<Student> searchStudents(@Param("query") String query);

    List<Student> findAllByOrderByIdDesc();
}
