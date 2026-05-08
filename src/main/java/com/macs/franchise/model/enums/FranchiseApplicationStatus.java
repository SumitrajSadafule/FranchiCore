package com.macs.franchise.model.enums;

public enum FranchiseApplicationStatus {
    NEW("New application"),
    UNDER_REVIEW("Under review"),
    INTERVIEW_SCHEDULED("Interview scheduled"),
    APPROVED("Application approved"),
    REJECTED("Application rejected");
    
    private final String description;
    
    FranchiseApplicationStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}