package org.example.backend;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class TestController
{
    @GetMapping("/")
    public String home()
    {
        return "Welcome to the Home Page! Your Spring Boot app is up and running.";
    }
}
