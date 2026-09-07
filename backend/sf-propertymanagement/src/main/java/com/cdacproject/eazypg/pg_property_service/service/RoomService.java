package com.cdacproject.eazypg.pg_property_service.service;

import com.cdacproject.eazypg.pg_property_service.exception.ResourceNotFoundException;
import com.cdacproject.eazypg.pg_property_service.model.PG;
import com.cdacproject.eazypg.pg_property_service.model.Room;
import com.cdacproject.eazypg.pg_property_service.repository.PGRepository;
import com.cdacproject.eazypg.pg_property_service.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class RoomService {

    private static final Logger log = LoggerFactory.getLogger(RoomService.class);

    private final RoomRepository roomRepository;
    private final PGRepository pgRepository;

    public RoomService(RoomRepository roomRepository, PGRepository pgRepository) {
        this.roomRepository = roomRepository;
        this.pgRepository = pgRepository;
    }

    /**  Add room under PG */
    @Transactional
    public Room addRoom(Long pgId, Long ownerId, Room room) {
        PG pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new ResourceNotFoundException("PG not found with id: " + pgId));

        if (!pg.getOwnerId().equals(ownerId)) {
            log.error("Unauthorized attempt to add room to PG {} by user {}", pgId, ownerId);
            throw new ResourceNotFoundException("You do not own this PG");
        }

        room.setPg(pg);
        Room saved = roomRepository.save(room);
        log.info("Room {} added to PG {} by Owner {}", saved.getId(), pgId, ownerId);
        return saved;
    }

    /** Get rooms with filters */
    public Page<Room> getRoomsByPG(Long pgId, Boolean available, Double minRent, Double maxRent, Pageable pageable) {
        if (available != null && minRent != null && maxRent != null) {
            return roomRepository.findByPgIdAndAvailableAndRentBetween(pgId, available, minRent, maxRent, pageable);
        } else if (available != null) {
            return roomRepository.findByPgIdAndAvailable(pgId, available, pageable);
        } else if (minRent != null && maxRent != null) {
            return roomRepository.findByPgIdAndRentBetween(pgId, minRent, maxRent, pageable);
        }
        return roomRepository.findByPgId(pgId, pageable);
    }


    /**  Get single room */
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    /** Delete room */
    @Transactional
    public void deleteRoom(Long roomId, Long ownerId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        if (!room.getPg().getOwnerId().equals(ownerId)) {
            log.error("Unauthorized delete attempt for Room {} by user {}", roomId, ownerId);
            throw new ResourceNotFoundException("You do not own this Room");
        }

        roomRepository.delete(room);
        log.warn("Room {} deleted by Owner {}", roomId, ownerId);
    }

    /**  Get all rooms (list, no paging) */
    public List<Room> getRoomsByPG(Long pgId) {
        return roomRepository.findByPgId(pgId);
    }

    public Optional<Room> getRoomByPgIdAndRoomId(Long pgId, Long roomId) {
        return roomRepository.findByIdAndPgId(roomId, pgId);
    }

    @Transactional
    public void updateAvailability(Long pgId, Long roomId, boolean available) {
        Room room = roomRepository.findByIdAndPgId(roomId, pgId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        room.setAvailable(available);
        roomRepository.save(room);
    }


}
