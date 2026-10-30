package com.example.studentmanagement.service.impl;

import com.example.studentmanagement.dto.StudentRequestDto;
import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.dto.StudentStatsDto;
import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.exception.DuplicateRollNumberException;
import com.example.studentmanagement.exception.ResourceNotFoundException;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.service.StudentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentResponseDto addStudent(StudentRequestDto requestDto) {
        String cleanRollNo = requestDto.getRollNumber().trim().toUpperCase();

        Optional<Student> existing = studentRepository.findByRollNumberIgnoreCase(cleanRollNo);
        if (existing.isPresent()) {
            throw new DuplicateRollNumberException(cleanRollNo, existing.get().getName());
        }

        Student student = new Student(
                requestDto.getName().trim(),
                cleanRollNo,
                requestDto.getBranch().trim(),
                requestDto.getMarks()
        );

        Student saved = studentRepository.save(student);
        return new StudentResponseDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAllByOrderByIdDesc().stream()
                .map(StudentResponseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return new StudentResponseDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> searchByRollNumber(String rollNumber) {
        if (rollNumber == null || rollNumber.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.findByRollNumberContainingIgnoreCase(rollNumber.trim()).stream()
                .map(StudentResponseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim()).stream()
                .map(StudentResponseDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDto updateStudent(Long id, StudentRequestDto requestDto) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        String cleanRollNo = requestDto.getRollNumber().trim().toUpperCase();

        if (studentRepository.existsByRollNumberIgnoreCaseAndIdNot(cleanRollNo, id)) {
            Optional<Student> other = studentRepository.findByRollNumberIgnoreCase(cleanRollNo);
            String otherName = other.map(Student::getName).orElse("another student");
            throw new DuplicateRollNumberException(cleanRollNo, otherName);
        }

        existingStudent.setName(requestDto.getName().trim());
        existingStudent.setRollNumber(cleanRollNo);
        existingStudent.setBranch(requestDto.getBranch().trim());
        existingStudent.setMarks(requestDto.getMarks());

        Student updated = studentRepository.save(existingStudent);
        return new StudentResponseDto(updated);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentStatsDto getStudentStats() {
        List<Student> students = studentRepository.findAll();
        long total = students.size();

        if (total == 0) {
            return new StudentStatsDto(0, 0.0, 0.0, 0.0, 0, 0, 0.0);
        }

        DoubleSummaryStatistics stats = students.stream()
                .mapToDouble(Student::getMarks)
                .summaryStatistics();

        double avg = BigDecimal.valueOf(stats.getAverage())
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        long passCount = students.stream().filter(s -> s.getMarks() >= 40.0).count();
        long failCount = total - passCount;
        double passPct = BigDecimal.valueOf(((double) passCount / total) * 100.0)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();

        return new StudentStatsDto(
                total,
                avg,
                stats.getMax(),
                stats.getMin(),
                passCount,
                failCount,
                passPct
        );
    }
}
