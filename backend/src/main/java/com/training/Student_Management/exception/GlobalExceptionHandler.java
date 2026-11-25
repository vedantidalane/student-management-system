package com.training.Student_Management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle resource not found (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            ResourceNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 404,
                        "error", ex.getMessage()
                )
        );
    }

    // Handle duplicate resources (409)
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicate(
            DuplicateResourceException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 409,
                        "error", ex.getMessage()
                )
        );
    }

    // Handle DTO validation errors (400)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> validationErrors = new LinkedHashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                validationErrors.put(
                        error.getField(),
                        error.getDefaultMessage()
                )
        );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 400);
        response.put("error", "Validation failed");
        response.put("messages", validationErrors);

        return ResponseEntity.badRequest().body(response);
    }

    // Handle invalid or malformed JSON requests (400)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidRequest(
            HttpMessageNotReadableException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 400,
                        "error", "Invalid request body or JSON format"
                )
        );
    }

    // Handle unexpected server errors (500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(
            Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", 500,
                        "error", "An unexpected server error occurred"
                )
        );
    }
}