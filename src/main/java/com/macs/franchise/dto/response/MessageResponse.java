package com.macs.franchise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Simple message response DTO
 * Used for returning status messages to client
 * 
 * @author MAC's Franchise
 * @version 1.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private boolean success;
    
    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
    }
    
    public static MessageResponse success(String message) {
        return new MessageResponse(message, true);
    }
    
    public static MessageResponse error(String message) {
        return new MessageResponse(message, false);
    }
}