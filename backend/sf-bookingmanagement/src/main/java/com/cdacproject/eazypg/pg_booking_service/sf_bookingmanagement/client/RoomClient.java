package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.client;

import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.config.FeignClientConfig;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.RoomDto;
import com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto.RoomResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@FeignClient("SF-PROPERTY-SERVICE")
public interface RoomClient {
    @PreAuthorize("hasAnyRole('OWNER','TENANT')")
    @GetMapping("api/pgs/{pgId}/rooms/{roomId}")
    public ResponseEntity<RoomResponseDto> getRoomByPgAndRoomId(
            @PathVariable Long pgId,
            @PathVariable Long roomId);


    @PutMapping("/api/pgs/{pgId}/rooms/{roomId}/availability")
    void updateRoomAvailability(
                @PathVariable("pgId") Long pgId,
                @PathVariable("roomId") Long roomId,
                @RequestParam("available") boolean available
    );

}
