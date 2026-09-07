package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.client;

import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.config.FeignClientConfig;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.PGDto;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.PGResponseDto;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.RoomDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "sf-property-service", configuration = FeignClientConfig.class)
public interface PGPropertyClient {

    @PreAuthorize("hasAnyRole('OWNER','TENANT')")
    @GetMapping("api/pgs/{id}")
    public ResponseEntity<PGResponseDto> getById(@PathVariable Long id);
}

