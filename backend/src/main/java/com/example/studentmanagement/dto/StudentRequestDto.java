package com.example.studentmanagement.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class StudentRequestDto {

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s.'-]+$", message = "Student name should contain only letters, spaces, hyphens, and dots")
    private String name;

    @NotBlank(message = "Roll number is required")
    @Size(min = 2, max = 30, message = "Roll number must be between 2 and 30 characters")
    private String rollNumber;

    @NotBlank(message = "Branch is required")
    @Size(min = 2, max = 50, message = "Branch must be between 2 and 50 characters")
    private String branch;

    @NotNull(message = "Marks are required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Marks must be between 0 and 100")
    @DecimalMax(value = "100.0", inclusive = true, message = "Marks must be between 0 and 100")
    private Double marks;

    public StudentRequestDto() {
    }

    public StudentRequestDto(String name, String rollNumber, String branch, Double marks) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.marks = marks;
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
}
