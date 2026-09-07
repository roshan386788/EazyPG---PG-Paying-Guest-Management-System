package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateBookingRequest {

    @NotNull(message = "PG ID is required")
    private Long pgId;

    @NotNull(message = "Room ID is required")
    private Long roomId;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;
}
