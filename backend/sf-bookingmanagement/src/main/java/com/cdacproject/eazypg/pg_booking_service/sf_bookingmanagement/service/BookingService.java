package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.service;

import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.BookingResponse;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.CreateBookingRequest;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.entity.Booking;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(CreateBookingRequest request, Long tenantId);
    void cancelBooking(Long bookingId, Long tenantId);
    List<BookingResponse> getBookingsByTenant(Long tenantId);

    BookingResponse getBookingById(Long bookingId);
}
