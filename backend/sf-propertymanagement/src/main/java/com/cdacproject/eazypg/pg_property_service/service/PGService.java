package com.cdacproject.eazypg.pg_property_service.service;

import com.cdacproject.eazypg.pg_property_service.exception.ResourceNotFoundException;
import com.cdacproject.eazypg.pg_property_service.model.PG;
import com.cdacproject.eazypg.pg_property_service.repository.PGRepository;
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
public class PGService {

    private static final Logger log = LoggerFactory.getLogger(PGService.class);

    private final PGRepository pgRepository;

    public PGService(PGRepository pgRepository) {
        this.pgRepository = pgRepository;
    }

    /**  Create PG */
    @Transactional
    public PG createPG(PG pg, Long ownerId) {
        pg.setOwnerId(ownerId);
        PG saved = pgRepository.save(pg);
        log.info("PG created with ID {} by Owner {}", saved.getId(), ownerId);
        return saved;
    }

    /**  Get all PGs (with optional city filter) */
    public Page<PG> getAllPGs(String city, Pageable pageable) {
        Page<PG> page = (city != null && !city.isEmpty())
                ? pgRepository.findByCityIgnoreCase(city, pageable)
                : pgRepository.findAll(pageable);

        log.debug("Fetched {} PGs (city filter: {})", page.getTotalElements(), city);
        return page;
    }

    /**  Get PGs by owner */
    public List<PG> getPGsByOwnerId(Long ownerId) {
        log.debug("Fetching PGs for ownerId {}", ownerId);
        return pgRepository.findByOwnerId(ownerId);
    }

    /**  Get PG by ID */
    public Optional<PG> getPGById(Long id) {
        log.debug("Fetching PG with ID {}", id);
        return pgRepository.findById(id);
    }

    /**  Delete PG (only if owned by user) */
    @Transactional
    public void deletePG(Long id, Long ownerId) {
        PG pg = pgRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PG not found with id: " + id));

        if (!pg.getOwnerId().equals(ownerId)) {
            log.error("Unauthorized delete attempt for PG {} by user {}", id, ownerId);
            throw new ResourceNotFoundException("You do not own this PG");
        }

        pgRepository.delete(pg);
        log.warn("PG deleted with ID {} by Owner {}", id, ownerId);
    }
}
