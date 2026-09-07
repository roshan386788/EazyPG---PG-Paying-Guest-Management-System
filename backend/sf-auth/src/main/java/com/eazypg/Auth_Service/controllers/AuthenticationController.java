package com.eazypg.Auth_Service.controllers;

import com.eazypg.Auth_Service.dto.AuthenticationRequest;
import com.eazypg.Auth_Service.dto.AuthenticationResponse;
import com.eazypg.Auth_Service.dto.RegisterUserRequestDTO;
import com.eazypg.Auth_Service.services.interfaces.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterUserRequestDTO request) {

        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request) {

        if (request == null) {
            log.error("Request body is null");
            throw new IllegalArgumentException("Request body cannot be null");
        }
        log.info("Received login request for email: {}", request.getEmail());
        return ResponseEntity.ok(authService.authenticate(request));

    }
}
