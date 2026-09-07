package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto;

import lombok.Data;

@Data
public class PGDto {
    private Long id;
    private String name;
    private String city;
    private Long ownerId;
}
