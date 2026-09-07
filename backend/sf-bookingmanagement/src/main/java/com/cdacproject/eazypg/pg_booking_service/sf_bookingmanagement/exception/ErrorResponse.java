package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int statusCode;
    private String message;
    private String timestamp;
    private String path;

    public ErrorResponse(int statusCode, String message, String path) {
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = java.time.LocalDateTime.now().toString();
        this.path = path;
    }
}
