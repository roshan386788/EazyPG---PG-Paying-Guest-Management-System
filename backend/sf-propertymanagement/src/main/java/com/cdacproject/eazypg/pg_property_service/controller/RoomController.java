package com.cdacproject.eazypg.pg_property_service.controller;

import com.cdacproject.eazypg.pg_property_service.dto.RoomDto;
import com.cdacproject.eazypg.pg_property_service.dto.RoomResponseDto;
import com.cdacproject.eazypg.pg_property_service.exception.ErrorResponse;
import com.cdacproject.eazypg.pg_property_service.exception.ResourceNotFoundException;
import com.cdacproject.eazypg.pg_property_service.mapper.RoomMapper;
import com.cdacproject.eazypg.pg_property_service.model.Room;
import com.cdacproject.eazypg.pg_property_service.service.FileStorageService;
import com.cdacproject.eazypg.pg_property_service.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@RestController
@RequestMapping("/api/pgs/{pgId}/rooms")
public class RoomController {

    private final RoomService roomService;
    private final RoomMapper roomMapper;
    private final FileStorageService fileStorage;

    @Value("${gateway.base-url}")
    private String gatewayUrl;

    private static final Logger log = LoggerFactory.getLogger(RoomController.class);

    public RoomController(RoomService roomService, RoomMapper roomMapper, FileStorageService fileStorage) {
        this.roomService = roomService;
        this.roomMapper = roomMapper;
        this.fileStorage = fileStorage;
    }

    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> addRoom(@PathVariable Long pgId,
                                     @RequestPart("room") String roomJson,
                                     @RequestPart(value = "image", required = false) MultipartFile image,
                                     HttpServletRequest request) throws IOException {

        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "Missing X-User-Id header", request.getRequestURI()));
        }

        try {
            Long ownerId = Long.valueOf(userIdHeader);
            log.info("Creating room for PG ID: {}, Owner ID: {}", pgId, ownerId);

            // Manually parse JSON string to RoomDto
            ObjectMapper mapper = new ObjectMapper();
            RoomDto roomDto = mapper.readValue(roomJson, RoomDto.class);

            roomDto.setPgId(pgId);

            log.debug("RoomDto parsed: {}", roomDto);

            Room room = roomMapper.toEntity(roomDto);

            if (image != null && !image.isEmpty()) {
                String filename = fileStorage.saveFile(image);
                room.setImageUrl(filename);
            }

            Room saved = roomService.addRoom(pgId, ownerId, room);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(roomMapper.toResponseDto(saved, gatewayUrl));

        } catch (Exception ex) {
            log.error("Error while creating room for PG ID {}: {}", pgId, ex.getMessage(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(500, "An error occurred while creating room", request.getRequestURI()));
        }
    }


    @PreAuthorize("hasAnyRole('OWNER','TENANT','ADMIN')")
    @GetMapping
    public ResponseEntity<Page<RoomResponseDto>> getRooms(@PathVariable Long pgId,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          @RequestParam(required = false) Boolean available,
                                                          @RequestParam(required = false) Double minPrice,
                                                          @RequestParam(required = false) Double maxPrice) {
        Pageable pageable = PageRequest.of(page, size);

        Page<RoomResponseDto> rooms = roomService.getRoomsByPG(pgId, available, minPrice, maxPrice, pageable)
                .map(room -> roomMapper.toResponseDto(room, gatewayUrl));

        return ResponseEntity.ok(rooms);
    }

    @PreAuthorize("hasRole('OWNER')")
    @DeleteMapping("/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId, HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "Missing X-User-Id header", request.getRequestURI()));
        }
        Long ownerId = Long.valueOf(userIdHeader);

        roomService.deleteRoom(roomId, ownerId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('OWNER','TENANT')")
    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponseDto> getRoomByPgAndRoomId(
            @PathVariable Long pgId,
            @PathVariable Long roomId
    ) {
        Room room = roomService.getRoomByPgIdAndRoomId(pgId, roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found for PG ID: " + pgId + ", Room ID: " + roomId));

        RoomResponseDto responseDto = new RoomResponseDto(
                room.getId(),
                room.getPg().getId(),
                room.getNumber(),
                room.getType(),
                room.getRent(),
                room.isAvailable(),
                room.getImageUrl()
        );

        return ResponseEntity.ok(responseDto);
    }

    // RoomController.java
    @PutMapping("/{roomId}/availability")
    public ResponseEntity<Void> updateRoomAvailability(
            @PathVariable Long pgId,
            @PathVariable Long roomId,
            @RequestParam boolean available
    ) {
        roomService.updateAvailability(pgId, roomId, available);
        return ResponseEntity.ok().build();
    }


}
