package com.macs.franchise.config;

import com.macs.franchise.model.FranchiseApplication;
import com.macs.franchise.model.enums.FranchiseApplicationStatus;
import com.macs.franchise.repository.FranchiseApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@Order(4)
public class FranchiseApplicationDataInitializer implements CommandLineRunner {

    @Autowired
    private FranchiseApplicationRepository applicationRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("===== CHECKING AND INITIALIZING FRANCHISE APPLICATIONS =====");

        if (applicationRepository.count() == 0) {
            
            // Application 1 - New
            FranchiseApplication app1 = new FranchiseApplication();
            app1.setFullName("Rajesh Sharma");
            app1.setAge(35);
            app1.setAddress("45 Marine Drive, Mumbai");
            app1.setPhone("9876543210");
            app1.setEmail("rajesh.sharma@example.com");
            app1.setQualification("MBA");
            app1.setInstitution("IIM Ahmedabad");
            app1.setGraduationYear(2015);
            app1.setNetWorth(new BigDecimal("5000000"));
            app1.setLiquidCapital(new BigDecimal("2000000"));
            app1.setSourceOfFunds("Personal savings and bank loan");
            app1.setPreferredCity("Mumbai");
            app1.setReasonForInterest("I love MAC's brand and see great potential in Mumbai market");
            app1.setPreviousOwnership(true);
            app1.setOwnershipDetails("Owned a restaurant chain in Pune for 5 years");
            app1.setWillingToTrain(true);
            app1.setPanNumber("ABCDE1234F");
            app1.setAadhaarNumber("123456789012");
            app1.setStatus(FranchiseApplicationStatus.NEW);

            // Application 2 - Under Review
            FranchiseApplication app2 = new FranchiseApplication();
            app2.setFullName("Priya Patel");
            app2.setAge(29);
            app2.setAddress("78 Brigade Road, Bangalore");
            app2.setPhone("9876543211");
            app2.setEmail("priya.patel@example.com");
            app2.setQualification("Bachelor's in Hospitality");
            app2.setInstitution("Christ University");
            app2.setGraduationYear(2017);
            app2.setNetWorth(new BigDecimal("3000000"));
            app2.setLiquidCapital(new BigDecimal("1500000"));
            app2.setSourceOfFunds("Family business and personal savings");
            app2.setPreferredCity("Bangalore");
            app2.setReasonForInterest("Bangalore has growing food culture and MAC's would be perfect");
            app2.setPreviousOwnership(false);
            app2.setOwnershipDetails("No previous ownership but managed family restaurant");
            app2.setWillingToTrain(true);
            app2.setPanNumber("FGHIJ5678K");
            app2.setAadhaarNumber("234567890123");
            app2.setStatus(FranchiseApplicationStatus.UNDER_REVIEW);
            app2.setAdminNotes("Initial review complete. Financials look good.");
            app2.setReviewedBy("admin@macs.com");
            app2.setReviewedDate(LocalDateTime.now().minusDays(2));

            // Application 3 - Interview Scheduled
            FranchiseApplication app3 = new FranchiseApplication();
            app3.setFullName("Amit Kumar");
            app3.setAge(42);
            app3.setAddress("23 Connaught Place, Delhi");
            app3.setPhone("9876543212");
            app3.setEmail("amit.kumar@example.com");
            app3.setQualification("B.Com");
            app3.setInstitution("Delhi University");
            app3.setGraduationYear(2005);
            app3.setNetWorth(new BigDecimal("8000000"));
            app3.setLiquidCapital(new BigDecimal("3500000"));
            app3.setSourceOfFunds("Business profits and investments");
            app3.setPreferredCity("Delhi");
            app3.setReasonForInterest("Excellent location available in CP, perfect for MAC's");
            app3.setPreviousOwnership(true);
            app3.setOwnershipDetails("Own 3 successful food outlets in Delhi NCR");
            app3.setWillingToTrain(true);
            app3.setPanNumber("KLMNO9012P");
            app3.setAadhaarNumber("345678901234");
            app3.setStatus(FranchiseApplicationStatus.INTERVIEW_SCHEDULED);
            app3.setAdminNotes("Strong candidate. Interview scheduled for next week.");
            app3.setReviewedBy("admin@macs.com");
            app3.setReviewedDate(LocalDateTime.now().minusDays(5));

            // Application 4 - Approved
            FranchiseApplication app4 = new FranchiseApplication();
            app4.setFullName("Sunita Reddy");
            app4.setAge(38);
            app4.setAddress("56 Jubilee Hills, Hyderabad");
            app4.setPhone("9876543213");
            app4.setEmail("sunita.reddy@example.com");
            app4.setQualification("MBA Marketing");
            app4.setInstitution("ISB Hyderabad");
            app4.setGraduationYear(2010);
            app4.setNetWorth(new BigDecimal("10000000"));
            app4.setLiquidCapital(new BigDecimal("5000000"));
            app4.setSourceOfFunds("Own business and investments");
            app4.setPreferredCity("Hyderabad");
            app4.setReasonForInterest("Hyderabad market is ready for MAC's expansion");
            app4.setPreviousOwnership(true);
            app4.setOwnershipDetails("Own 2 successful restaurants in Hyderabad");
            app4.setWillingToTrain(true);
            app4.setPanNumber("QRSTU3456V");
            app4.setAadhaarNumber("456789012345");
            app4.setStatus(FranchiseApplicationStatus.APPROVED);
            app4.setAdminNotes("Excellent candidate. Approved for franchise ownership.");
            app4.setReviewedBy("admin@macs.com");
            app4.setReviewedDate(LocalDateTime.now().minusDays(10));

            // Application 5 - Rejected
            FranchiseApplication app5 = new FranchiseApplication();
            app5.setFullName("Vikram Singh");
            app5.setAge(45);
            app5.setAddress("89 Park Street, Kolkata");
            app5.setPhone("9876543214");
            app5.setEmail("vikram.singh@example.com");
            app5.setQualification("High School");
            app5.setInstitution("Local School");
            app5.setGraduationYear(1998);
            app5.setNetWorth(new BigDecimal("1000000"));
            app5.setLiquidCapital(new BigDecimal("200000"));
            app5.setSourceOfFunds("Personal savings");
            app5.setPreferredCity("Kolkata");
            app5.setReasonForInterest("Want to start a new business");
            app5.setPreviousOwnership(false);
            app5.setOwnershipDetails("No experience in food business");
            app5.setWillingToTrain(true);
            app5.setPanNumber("WXYZ7890A");
            app5.setAadhaarNumber("567890123456");
            app5.setStatus(FranchiseApplicationStatus.REJECTED);
            app5.setAdminNotes("Insufficient capital and no relevant experience");
            app5.setReviewedBy("admin@macs.com");
            app5.setReviewedDate(LocalDateTime.now().minusDays(15));

            List<FranchiseApplication> applications = Arrays.asList(app1, app2, app3, app4, app5);
            applicationRepository.saveAll(applications);
            
            System.out.println("✅ Added " + applications.size() + " sample franchise applications");
        } else {
            System.out.println("ℹ️ Franchise applications already exist: " + applicationRepository.count());
        }

        System.out.println("===== FRANCHISE APPLICATIONS INITIALIZATION COMPLETE =====");
    }
}