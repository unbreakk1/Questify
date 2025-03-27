package org.example.backend.dto;

public class AuthenticationRequest
{
    private String username; // Login username
    private String password; // Login password

    // Getters and Setters
    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }
}
