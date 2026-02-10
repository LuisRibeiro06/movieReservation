package com.movie.system.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.movie.system.model.User;
import org.bouncycastle.math.ec.rfc8032.Ed25519;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;


@Service
public class TokenService {


    @Value("${api.security.token.secret}")
    private String secretKey;

    public String generateToken(User user){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            String role = (user.getRole() != null) ? user.getRole().getName() : "USER";

            String token = JWT.create()
                    .withIssuer("Movie Reservation")
                    .withSubject(user.getUsername())
                    .withClaim("role", role)
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
            return token;
        }catch (JWTCreationException exception){
            throw new RuntimeException("Error while generating token", exception);
        }
    }

    public String validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.require(algorithm)
                    .withIssuer("Movie Reservation")
                    .build()
                    .verify(token)
                    .getSubject();
        }catch (JWTVerificationException exception){
            return "";
        }
    }

    public String getRoleFromToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            return JWT.require(algorithm)
                    .withIssuer("Movie Reservation")
                    .build()
                    .verify(token)
                    .getClaim("role").asString();
        } catch (JWTVerificationException exception){
            return "";
        }
    }

    private Instant generateExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-05:00"));
    }
}
