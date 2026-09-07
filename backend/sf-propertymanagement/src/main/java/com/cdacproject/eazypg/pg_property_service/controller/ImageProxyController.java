package com.cdacproject.eazypg.pg_property_service.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImageProxyController {

    @GetMapping("/{filename:.+}")
    public ResponseEntity<byte[]> getImage(
            @PathVariable String filename,
            @RequestHeader("Authorization") String authHeader
    ) throws IOException {
        // ✅ Check JWT token manually or let Spring Security handle it

        // Path where images are stored
        Path imagePath = Paths.get("uploads").resolve(filename);

        if (!Files.exists(imagePath)) {
            return ResponseEntity.notFound().build();
        }

        byte[] imageBytes = Files.readAllBytes(imagePath);
        String contentType = Files.probeContentType(imagePath);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(imageBytes);
    }
}

