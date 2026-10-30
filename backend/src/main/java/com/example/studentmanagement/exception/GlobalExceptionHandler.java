package com.example.studentmanagement.exception;

import com.example.studentmanagement.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        String summary = errors.values().stream().findFirst().orElse("Invalid input data");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ValidationErrorResponse("Validation failed: " + summary, errors));
    }

    @ExceptionHandler(DuplicateRollNumberException.class)
    public ResponseEntity<ValidationErrorResponse> handleDuplicateRollNumber(DuplicateRollNumberException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        errors.put("rollNumber", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ValidationErrorResponse(ex.getMessage(), errors));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ValidationErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        errors.put("rollNumber", "A student with this roll number already exists.");
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ValidationErrorResponse("A database constraint was violated. Roll number may already exist.", errors));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ValidationErrorResponse> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        String msg = "Malformed JSON request or invalid data type. Please check numeric fields such as marks.";
        if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("double")) {
            errors.put("marks", "Marks must be a valid numeric number between 0 and 100.");
            msg = "Marks must be a valid numeric number between 0 and 100.";
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ValidationErrorResponse(msg, errors));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Invalid parameter: " + ex.getName()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred: " + ex.getMessage()));
    }
}
