package com.cdacproject.eazypg.pg_property_service.repository;

import com.cdacproject.eazypg.pg_property_service.dto.PGResponseDto;
import com.cdacproject.eazypg.pg_property_service.model.PG;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PGRepository extends JpaRepository<PG, Long> {
    List<PG> findByOwnerId(Long ownerId);
    List<PG> findByCity(String city);
    Page<PG> findByCityIgnoreCase(String city, Pageable pageable);

}
