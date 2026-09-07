package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto;

import lombok.Data;

@Data
public class RoomDto {
    private Long id;
    private Long pgId;
    private String name;
    private boolean available;
}
