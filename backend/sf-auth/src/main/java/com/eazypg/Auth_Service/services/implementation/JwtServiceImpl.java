package com.eazypg.Auth_Service.services.implementation;


import java.io.InputStream;
import java.security.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.eazypg.Auth_Service.dto.UserDTO;
import com.eazypg.Auth_Service.services.interfaces.JwtService;
import jakarta.annotation.PostConstruct;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


@Service
public class JwtServiceImpl implements JwtService {


    @Value("${jwt.keystore.location}")
    private Resource keystore;

    @Value("${jwt.keystore.password}")
    private String keystorePassword;

    @Value("${jwt.keystore.alias}")
    private String keyAlias;

    private PrivateKey privateKey;
    private PublicKey publicKey;


    @PostConstruct
    public void init() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("JKS");
        try (InputStream inputStream = keystore.getInputStream()) {
            keyStore.load(inputStream, keystorePassword.toCharArray());
        }

        Key key = keyStore.getKey(keyAlias, keystorePassword.toCharArray());
        if (key instanceof PrivateKey) {
            privateKey = (PrivateKey) key;
            publicKey = keyStore.getCertificate(keyAlias).getPublicKey();
        } else {
            throw new RuntimeException("Invalid key");
        }
    }

    public String extractUsername(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(@NotNull UserDTO userDto) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDto.getRole());
        claims.put("userId", userDto.getId());
        return generateToken(claims, userDto);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder().setClaims(extraClaims).setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(publicKey).build().parseClaimsJws(token).getBody();
    }

}
