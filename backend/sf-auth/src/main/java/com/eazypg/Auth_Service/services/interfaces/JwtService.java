package com.eazypg.Auth_Service.services.interfaces;

import com.eazypg.Auth_Service.dto.UserDTO;
import io.jsonwebtoken.Claims;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Map;
import java.util.function.Function;

public interface JwtService {

    public String extractUsername(String token);

    public String generateToken(@NotNull UserDTO userDto);

    public boolean isTokenValid(String token, UserDetails userDetails);


    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails);

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver);
}
