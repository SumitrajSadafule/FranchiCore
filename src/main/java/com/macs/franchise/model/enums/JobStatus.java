package com.macs.franchise.model.enums;

public enum JobStatus {
    OPEN("Open for applications"),
    CLOSED("Position filled"),
    ON_HOLD("On hold");
    
    private final String description;
    
    JobStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}