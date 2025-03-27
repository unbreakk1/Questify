package org.example.backend.dto;

public class AuthenticationResponse {
    private String token; // Token returned upon successful login

    public AuthenticationResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}