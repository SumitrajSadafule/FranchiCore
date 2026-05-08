package com.macs.franchise.model.enums;

/**
 * Enumeration for franchise status
 * 
 * @author MAC's Franchise
 * @version 1.0
 */
public enum FranchiseStatus {
    ACTIVE("Franchise is operational"),
    UNDER_REVIEW("Franchise under review"),
    PROBATION("Franchise on probation period"),
    SUSPENDED("Franchise temporarily suspended"),
    CLOSED("Franchise permanently closed"),
    PENDING_APPROVAL("New franchise pending approval");
    
    private final String description;
    
    FranchiseStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}