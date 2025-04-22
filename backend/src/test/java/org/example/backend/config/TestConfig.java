package org.example.backend.config;

import org.example.backend.util.JwtUtil;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import java.util.Properties;

@TestConfiguration
@Profile("test")
public class TestConfig
{

    @Bean
    @Primary
    public JwtUtil jwtUtilTest()
    {
        return new JwtUtil();
    }

    @Bean
    @Primary
    public PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer()
    {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        Properties properties = new Properties();
        properties.setProperty("JWT_SECRET", "testsecretkey12345678901234567890123456789012");
        configurer.setProperties(properties);
        return configurer;
    }
}
