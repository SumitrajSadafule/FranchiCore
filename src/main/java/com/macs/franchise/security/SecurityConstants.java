package com.macs.franchise.security;

/**
 * Security constants for JWT and authentication
 * 
 * @author MAC's Franchise
 * @version 1.0
 */
public class SecurityConstants {
    
    // JWT Constants
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String SIGN_UP_URL = "/api/auth/**";
    
    // Roles
    public static final String ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN";
    public static final String ROLE_FRANCHISE_OWNER = "ROLE_FRANCHISE_OWNER";
    public static final String ROLE_CUSTOMER = "ROLE_CUSTOMER";
    
    // API Endpoints
    public static final String[] PUBLIC_URLS = {
        "/auth/**",
        "/public/**",
        "/error/**"
    };
    
    // Private constructor to prevent instantiation
    private SecurityConstants() {}
}