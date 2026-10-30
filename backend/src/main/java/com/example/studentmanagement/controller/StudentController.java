package com.example.studentmanagement.controller;

import com.example.studentmanagement.dto.ApiResponse;
import com.example.studentmanagement.dto.StudentRequestDto;
import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.dto.StudentStatsDto;
import com.example.studentmanagement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponseDto>> createStudent(@Valid @RequestBody StudentRequestDto requestDto) {
        StudentResponseDto created = studentService.addStudent(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student added successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponseDto>>> getAllStudents(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "rollNumber", required = false) String rollNumber
    ) {
        List<StudentResponseDto> students;
        if (rollNumber != null && !rollNumber.trim().isEmpty()) {
            students = studentService.searchByRollNumber(rollNumber.trim());
        } else if (search != null && !search.trim().isEmpty()) {
            students = studentService.searchStudents(search.trim());
        } else {
            students = studentService.getAllStudents();
        }
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponseDto>> getStudentById(@PathVariable Long id) {
        StudentResponseDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(student));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<StudentResponseDto>>> searchByRollNumber(
            @RequestParam(value = "rollNumber", required = false) String rollNumber,
            @RequestParam(value = "q", required = false) String q
    ) {
        String term = rollNumber != null ? rollNumber : q;
        List<StudentResponseDto> results = studentService.searchByRollNumber(term);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponseDto>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequestDto requestDto
    ) {
        StudentResponseDto updated = studentService.updateStudent(id, requestDto);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StudentStatsDto>> getStudentStats() {
        StudentStatsDto stats = studentService.getStudentStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
