package com.macs.franchise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for JWT authentication response
 * Sent to client after successful login
 * 
 * @author MAC's Franchise
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;
    private Long franchiseId;
    
    public JwtResponse(String token, Long id, String username, String email, 
                       String firstName, String lastName, List<String> roles, Long franchiseId) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
        this.franchiseId = franchiseId;
    }
}