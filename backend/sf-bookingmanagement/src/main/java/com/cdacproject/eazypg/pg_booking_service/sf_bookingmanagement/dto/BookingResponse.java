package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto;

import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;
    private Long pgId;
    private Long roomId;
    private Long tenantId;
    private BookingStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
}
