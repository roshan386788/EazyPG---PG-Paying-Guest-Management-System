package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.controller;

import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.BookingResponse;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.CreateBookingRequest;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.entity.Booking;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestHeader("X-User-Id") Long tenantId,
            @Valid @RequestBody CreateBookingRequest request) {
        log.info("Creating booking for tenantId: {}", tenantId);
        BookingResponse booking = bookingService.createBooking(request, tenantId);
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(
            @RequestHeader("X-User-Id") Long tenantId,
            @PathVariable Long bookingId
    ) {
        log.info("Cancelling bookingId: {} for tenantId: {}", bookingId, tenantId);
        bookingService.cancelBooking(bookingId, tenantId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getTenantBookings(
            @RequestHeader("X-User-Id") Long tenantId
    ) {
        log.info("Fetching bookings for tenantId: {}", tenantId);
        List<BookingResponse> bookings = bookingService.getBookingsByTenant(tenantId);
        return ResponseEntity.ok(bookings);
    }
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long bookingId) {
        BookingResponse response = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(response);
    }

}
