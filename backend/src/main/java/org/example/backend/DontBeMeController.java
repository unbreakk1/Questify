package org.example.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DontBeMeController
{
    @GetMapping("/")
    public String index()
    {
        return "index";

    }
}