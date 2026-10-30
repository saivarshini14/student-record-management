package com.example.studentmanagement.exception;

public class DuplicateRollNumberException extends RuntimeException {

    private final String rollNumber;

    public DuplicateRollNumberException(String rollNumber) {
        super(String.format("Roll number '%s' is already registered. Roll numbers must be unique.", rollNumber));
        this.rollNumber = rollNumber;
    }

    public DuplicateRollNumberException(String rollNumber, String existingStudentName) {
        super(String.format("Roll number '%s' is already assigned to %s. Roll numbers must be unique.", rollNumber, existingStudentName));
        this.rollNumber = rollNumber;
    }

    public String getRollNumber() {
        return rollNumber;
    }
}
