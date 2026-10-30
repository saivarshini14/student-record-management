package com.example.studentmanagement;

import com.example.studentmanagement.dto.StudentRequestDto;
import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.dto.StudentStatsDto;
import com.example.studentmanagement.exception.DuplicateRollNumberException;
import com.example.studentmanagement.service.StudentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class StudentServiceTest {

    @Autowired
    private StudentService studentService;

    @Test
    @DisplayName("Should successfully register a new student")
    void testAddStudentSuccess() {
        StudentRequestDto dto = new StudentRequestDto("Rahul Dravid", "CS2026-999", "Computer Science", 88.5);
        StudentResponseDto created = studentService.addStudent(dto);

        assertNotNull(created.getId());
        assertEquals("Rahul Dravid", created.getName());
        assertEquals("CS2026-999", created.getRollNumber());
        assertEquals("Computer Science", created.getBranch());
        assertEquals(88.5, created.getMarks());
        assertEquals("A", created.getGrade());
        assertEquals("PASS", created.getStatus());
    }

    @Test
    @DisplayName("Should throw DuplicateRollNumberException when roll number is duplicated")
    void testDuplicateRollNumberException() {
        StudentRequestDto dto1 = new StudentRequestDto("First Student", "TEST-ROLL-01", "Mechanical", 75.0);
        studentService.addStudent(dto1);

        StudentRequestDto dto2 = new StudentRequestDto("Second Student", "test-roll-01", "Civil", 82.0);
        assertThrows(DuplicateRollNumberException.class, () -> studentService.addStudent(dto2));
    }

    @Test
    @DisplayName("Should search student by roll number")
    void testSearchByRollNumber() {
        StudentRequestDto dto = new StudentRequestDto("Searchable Student", "SRCH-2026-777", "IT", 91.0);
        studentService.addStudent(dto);

        List<StudentResponseDto> results = studentService.searchByRollNumber("777");
        assertFalse(results.isEmpty());
        assertTrue(results.stream().anyMatch(s -> s.getRollNumber().equals("SRCH-2026-777")));
    }

    @Test
    @DisplayName("Should accurately calculate student statistics")
    void testStudentStats() {
        StudentStatsDto stats = studentService.getStudentStats();
        assertNotNull(stats);
        assertTrue(stats.getTotalStudents() >= 0);
        assertTrue(stats.getAverageMarks() >= 0);
    }

    @Test
    @DisplayName("Should update existing student record")
    void testUpdateStudent() {
        StudentRequestDto dto = new StudentRequestDto("Original Name", "UPD-001", "Electrical", 65.0);
        StudentResponseDto created = studentService.addStudent(dto);

        StudentRequestDto updateDto = new StudentRequestDto("Updated Name", "UPD-001", "Electrical & Electronics", 94.0);
        StudentResponseDto updated = studentService.updateStudent(created.getId(), updateDto);

        assertEquals("Updated Name", updated.getName());
        assertEquals(94.0, updated.getMarks());
        assertEquals("A+", updated.getGrade());
    }

    @Test
    @DisplayName("Should delete student record")
    void testDeleteStudent() {
        StudentRequestDto dto = new StudentRequestDto("To Delete", "DEL-999", "Chemical", 50.0);
        StudentResponseDto created = studentService.addStudent(dto);

        studentService.deleteStudent(created.getId());
        List<StudentResponseDto> search = studentService.searchByRollNumber("DEL-999");
        assertTrue(search.isEmpty());
    }
}
