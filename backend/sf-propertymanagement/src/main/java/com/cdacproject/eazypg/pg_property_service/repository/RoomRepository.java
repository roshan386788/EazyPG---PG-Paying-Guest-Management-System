package com.cdacproject.eazypg.pg_property_service.repository;

import com.cdacproject.eazypg.pg_property_service.model.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByPgId(Long pgId);  // For internal use
    
    Page<Room> findByPgId(Long pgId, Pageable pageable); // For paginated API

    Page<Room> findByPgIdAndAvailable(Long pgId, Boolean available, Pageable pageable);

    Page<Room> findByPgIdAndAvailableAndRentBetween(Long pgId, Boolean available, Double minRent, Double maxRent, Pageable pageable);
    
    Page<Room> findByPgIdAndRentBetween(Long pgId, Double minRent, Double maxRent, Pageable pageable);

    Optional<Room> findByIdAndPgId(Long roomId, Long pgId);

}

