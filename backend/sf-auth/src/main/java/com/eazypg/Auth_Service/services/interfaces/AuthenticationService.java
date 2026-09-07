package com.eazypg.Auth_Service.services.interfaces;

import com.eazypg.Auth_Service.dto.AuthenticationRequest;
import com.eazypg.Auth_Service.dto.AuthenticationResponse;
import com.eazypg.Auth_Service.dto.RegisterUserRequestDTO;

public interface AuthenticationService {
    public AuthenticationResponse register(RegisterUserRequestDTO request);

    public AuthenticationResponse authenticate(AuthenticationRequest request);
}
