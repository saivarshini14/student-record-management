package com.example.studentmanagement.service;

import com.example.studentmanagement.dto.StudentRequestDto;
import com.example.studentmanagement.dto.StudentResponseDto;
import com.example.studentmanagement.dto.StudentStatsDto;

import java.util.List;

public interface StudentService {

    StudentResponseDto addStudent(StudentRequestDto requestDto);

    List<StudentResponseDto> getAllStudents();

    StudentResponseDto getStudentById(Long id);

    List<StudentResponseDto> searchByRollNumber(String rollNumber);

    List<StudentResponseDto> searchStudents(String query);

    StudentResponseDto updateStudent(Long id, StudentRequestDto requestDto);

    void deleteStudent(Long id);

    StudentStatsDto getStudentStats();
}
