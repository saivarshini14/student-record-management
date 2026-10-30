package com.example.studentmanagement.dto;

import com.example.studentmanagement.entity.Student;
import java.time.LocalDateTime;

public class StudentResponseDto {

    private Long id;
    private String name;
    private String rollNumber;
    private String branch;
    private Double marks;
    private String grade;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentResponseDto() {
    }

    public StudentResponseDto(Student student) {
        if (student != null) {
            this.id = student.getId();
            this.name = student.getName();
            this.rollNumber = student.getRollNumber();
            this.branch = student.getBranch();
            this.marks = student.getMarks();
            this.grade = student.getGrade();
            this.status = student.getStatus();
            this.createdAt = student.getCreatedAt();
            this.updatedAt = student.getUpdatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
