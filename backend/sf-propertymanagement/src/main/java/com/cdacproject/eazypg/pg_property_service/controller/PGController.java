package com.cdacproject.eazypg.pg_property_service.controller;

import com.cdacproject.eazypg.pg_property_service.dto.PGDto;
import com.cdacproject.eazypg.pg_property_service.dto.PGResponseDto;
import com.cdacproject.eazypg.pg_property_service.exception.ErrorResponse;
import com.cdacproject.eazypg.pg_property_service.exception.ResourceNotFoundException;
import com.cdacproject.eazypg.pg_property_service.mapper.PGMapper;
import com.cdacproject.eazypg.pg_property_service.model.PG;
import com.cdacproject.eazypg.pg_property_service.service.FileStorageService;
import com.cdacproject.eazypg.pg_property_service.service.PGService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pgs")
public class PGController {

    private final PGService pgService;
    private final FileStorageService fileStorage;
    private final PGMapper pgMapper;

    @Value("${gateway.base-url}")
    private String gatewayUrl;

    private static final Logger log = LoggerFactory.getLogger(PGController.class);

    public PGController(PGService pgService, FileStorageService fileStorage, PGMapper pgMapper) {
        this.pgService = pgService;
        this.fileStorage = fileStorage;
        this.pgMapper = pgMapper;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> create(@RequestPart("pg") String pgJson,
                                    @RequestPart(value = "image", required = false) MultipartFile image,
                                    HttpServletRequest request) throws IOException {

        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "Missing user ID header", request.getRequestURI()));
        }

        ObjectMapper mapper = new ObjectMapper();
        PGDto pgDto = mapper.readValue(pgJson, PGDto.class);

        // Optional: Perform validation manually
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<PGDto>> violations = validator.validate(pgDto);
        if (!violations.isEmpty()) {
            String errorMessages = violations.stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest().body(new ErrorResponse(400, errorMessages, request.getRequestURI()));
        }

        Long ownerId = Long.valueOf(userIdHeader);
        log.info("Create PG requested by User ID: {}", ownerId);

        PG pg = new PG();
        pg.setName(pgDto.getName());
        pg.setType(pgDto.getType());
        pg.setAddress(pgDto.getAddress());
        pg.setCity(pgDto.getCity());
        pg.setState(pgDto.getState());
        pg.setPin(pgDto.getPin());
        pg.setContact(pgDto.getContact());
        pg.setLatitude(pgDto.getLatitude());
        pg.setLongitude(pgDto.getLongitude());
        pg.setOwnerId(ownerId);

        if (image != null) {
            String filename = fileStorage.saveFile(image);
            pg.setImageUrl(filename);
        }

        PG saved = pgService.createPG(pg, ownerId);

        PGResponseDto response = new PGResponseDto();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setType(saved.getType());
        response.setAddress(saved.getAddress());
        response.setCity(saved.getCity());
        response.setState(saved.getState());
        response.setPin(saved.getPin());
        response.setContact(saved.getContact());
        response.setOwnerId(saved.getOwnerId());
        response.setLatitude(saved.getLatitude());
        response.setLongitude(saved.getLongitude());
        response.setCreatedAt(saved.getCreatedAt());
        response.setUpdatedAt(saved.getUpdatedAt());
        if (saved.getImageUrl() != null) {
            response.setImageUrl(gatewayUrl + "/uploads/" + saved.getImageUrl());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }



    @PreAuthorize("hasAnyRole('OWNER','TENANT','ADMIN')")
    @GetMapping
    public ResponseEntity<Page<PGResponseDto>> getAll(@RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(required = false) String city) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<PGResponseDto> result = pgService.getAllPGs(city, pageable)
                .map(pg -> pgMapper.toResponseDto(pg, gatewayUrl));
        return ResponseEntity.ok(result);
    }


    @PreAuthorize("hasAnyRole('OWNER','TENANT','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PGResponseDto> getById(@PathVariable Long id) {
        PG pg = pgService.getPGById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PG not found with id: " + id));
        return ResponseEntity.ok(pgMapper.toResponseDto(pg, gatewayUrl));
    }

    @PreAuthorize("hasAnyRole('OWNER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(401, "Missing user ID header", request.getRequestURI()));
        }
        Long ownerId = Long.valueOf(userIdHeader);

        log.warn("User {} requested delete PG with ID {}", ownerId, id);
        pgService.deletePG(id, ownerId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<PGResponseDto>> getByOwnerId(@PathVariable Long ownerId) {
        List<PG> pgList = pgService.getPGsByOwnerId(ownerId);
        List<PGResponseDto> responseList = pgList.stream()
                .map(pg -> pgMapper.toResponseDto(pg, gatewayUrl))
                .toList();
        return ResponseEntity.ok(responseList);
    }

}
