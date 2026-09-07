package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.service.impl;

import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.client.PGPropertyClient;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.client.RoomClient;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.*;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.entity.Booking;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.entity.BookingStatus;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.exception.ResourceNotFoundException;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.exception.UnauthorizedActionException;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.repository.BookingRepository;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final RoomClient roomClient;
    private final PGPropertyClient pgPropertyClient;

    @Override
    public BookingResponse createBooking(CreateBookingRequest request, Long tenantId) {
        logger.info("Creating booking for tenant ID: {}", tenantId);

        RoomResponseDto room = roomClient.getRoomByPgAndRoomId(request.getPgId(),
               request.getRoomId()).getBody();
        if (room == null || !room.isAvailable()) {
            logger.warn("Room {} is not available for booking", request.getRoomId());
            throw new ResourceNotFoundException("Room not available for booking.");
        }

        ResponseEntity<PGResponseDto> pg = pgPropertyClient.getById(room.getPgId());

        logger.info("PG fetched with ID: {}", pg.getBody().getId());

        Booking booking = Booking.builder()
                .roomId(room.getId())
                .pgId(pg.getBody().getId())
                .tenantId(tenantId)
                .status(BookingStatus.BOOKED)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);
        logger.info("Booking created with ID: {}", saved.getId());

        roomClient.updateRoomAvailability(room.getPgId(), room.getId(), false);

        return mapToResponse(saved);
    }

    @Override
    public void cancelBooking(Long bookingId, Long tenantId) {
        logger.info("Attempting to cancel booking ID: {} by tenant ID: {}", bookingId, tenantId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getTenantId().equals(tenantId)) {
            logger.error("Unauthorized cancellation attempt by tenant ID: {}", tenantId);
            throw new UnauthorizedActionException("You can only cancel your own bookings.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        logger.info("Booking ID {} cancelled by tenant ID {}", bookingId, tenantId);
    }

    @Override
    public List<BookingResponse> getBookingsByTenant(Long tenantId) {
        logger.info("Fetching bookings for tenant ID: {}", tenantId);

        return bookingRepository.findByTenantId(tenantId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        return BookingResponse.builder()
                .id(booking.getId())
                .pgId(booking.getPgId())
                .roomId(booking.getRoomId())
                .tenantId(booking.getTenantId())
                .status(booking.getStatus())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .createdAt(booking.getCreatedAt())
                .build();
    }


    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .roomId(booking.getRoomId())
                .pgId(booking.getPgId())
                .tenantId(booking.getTenantId())
                .status(booking.getStatus())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
