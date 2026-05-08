package com.macs.franchise.model.enums;

public enum ApplicationStatus {
    NEW("New application"),
    UNDER_REVIEW("Under review"),
    INTERVIEW_SCHEDULED("Interview scheduled"),
    ACCEPTED("Application accepted"),
    REJECTED("Application rejected"),
    WITHDRAWN("Application withdrawn");
    
    private final String description;
    
    ApplicationStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}