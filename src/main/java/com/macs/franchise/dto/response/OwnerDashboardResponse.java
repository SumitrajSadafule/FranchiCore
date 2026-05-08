package com.macs.franchise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDashboardResponse {
    private FranchiseResponse franchise;
    private UserProfileResponse profile;
    private DashboardStats stats;
    private List<JobResponse> recentJobs;
    private List<FeedbackResponse> recentFeedback;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private long totalJobs;
        private long openJobs;
        private long totalApplications;
        private long newApplications;
        private long totalFeedback;
        private double averageRating;
        private Map<String, Long> applicationsByStatus;
    }
}