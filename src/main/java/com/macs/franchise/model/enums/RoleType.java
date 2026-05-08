package com.macs.franchise.model.enums;

/**
 * Enumeration for user roles in the system
 * Defines the different types of users and their access levels
 * 
 * @author MAC's Franchise
 * @version 1.0
 */
public enum RoleType {
    ROLE_SUPER_ADMIN("Super Administrator - Full system access"),
    ROLE_FRANCHISE_OWNER("Franchise Owner - Access to own franchise only"),
    ROLE_CUSTOMER("Customer - Public website access only"),
    ROLE_JOB_SEEKER("Job Seeker - Can apply for jobs"),
    ROLE_APPLICANT("Franchise Applicant - Submitted application");
    
    private final String description;
    
    RoleType(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}