package com.macs.franchise.config;

import com.macs.franchise.model.Feedback;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.Rating;
import com.macs.franchise.repository.FeedbackRepository;
import com.macs.franchise.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@Order(5)
public class FeedbackDataInitializer implements CommandLineRunner {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private FranchiseRepository franchiseRepository;

    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        System.out.println("===== CHECKING AND INITIALIZING FEEDBACK =====");

        if (feedbackRepository.count() == 0) {
            List<Franchise> franchises = franchiseRepository.findAll();
            
            if (franchises.isEmpty()) {
                System.out.println("⚠️ No franchises found. Skipping feedback initialization.");
                return;
            }

            // Create sample feedback for each franchise
            for (Franchise franchise : franchises) {
                createFeedbackForFranchise(franchise);
            }

            System.out.println("✅ Added sample feedback for all franchises");
        } else {
            System.out.println("ℹ️ Feedback already exists: " + feedbackRepository.count());
        }

        System.out.println("===== FEEDBACK INITIALIZATION COMPLETE =====");
    }

    private void createFeedbackForFranchise(Franchise franchise) {
        
        // Feedback 1 - 5 stars
        Feedback feedback1 = new Feedback();
        feedback1.setCustomerName("Amit Sharma");
        feedback1.setCustomerEmail("amit.sharma@example.com");
        feedback1.setCustomerPhone("9876543210");
        feedback1.setBillNumber("B" + (1000 + random.nextInt(9000)));
        feedback1.setRating(Rating.FIVE_STARS);
        feedback1.setComments("Excellent food and service! The burgers were amazing and the staff was very friendly.");
        feedback1.setWouldRecommend(true);
        feedback1.setServiceRating(5);
        feedback1.setFoodRating(5);
        feedback1.setCleanlinessRating(5);
        feedback1.setValueRating(4);
        feedback1.setFranchise(franchise);
        feedback1.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

        // Feedback 2 - 4 stars
        Feedback feedback2 = new Feedback();
        feedback2.setCustomerName("Priya Patel");
        feedback2.setCustomerEmail("priya.p@example.com");
        feedback2.setCustomerPhone("9876543211");
        feedback2.setBillNumber("B" + (1000 + random.nextInt(9000)));
        feedback2.setRating(Rating.FOUR_STARS);
        feedback2.setComments("Good food but waiting time was a bit long. The fries were perfect though!");
        feedback2.setWouldRecommend(true);
        feedback2.setServiceRating(3);
        feedback2.setFoodRating(5);
        feedback2.setCleanlinessRating(4);
        feedback2.setValueRating(4);
        feedback2.setFranchise(franchise);
        feedback2.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

        // Feedback 3 - 3 stars
        Feedback feedback3 = new Feedback();
        feedback3.setCustomerName("Rahul Verma");
        feedback3.setCustomerEmail("rahul.v@example.com");
        feedback3.setCustomerPhone("9876543212");
        feedback3.setBillNumber("B" + (1000 + random.nextInt(9000)));
        feedback3.setRating(Rating.THREE_STARS);
        feedback3.setComments("Average experience. Food was okay but the place was crowded and noisy.");
        feedback3.setWouldRecommend(false);
        feedback3.setServiceRating(3);
        feedback3.setFoodRating(3);
        feedback3.setCleanlinessRating(3);
        feedback3.setValueRating(3);
        feedback3.setFranchise(franchise);
        feedback3.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

        // Feedback 4 - 5 stars with reply
        Feedback feedback4 = new Feedback();
        feedback4.setCustomerName("Neha Gupta");
        feedback4.setCustomerEmail("neha.g@example.com");
        feedback4.setCustomerPhone("9876543213");
        feedback4.setBillNumber("B" + (1000 + random.nextInt(9000)));
        feedback4.setRating(Rating.FIVE_STARS);
        feedback4.setComments("Love this place! The new menu items are delicious. Will definitely come back.");
        feedback4.setWouldRecommend(true);
        feedback4.setServiceRating(5);
        feedback4.setFoodRating(5);
        feedback4.setCleanlinessRating(5);
        feedback4.setValueRating(5);
        feedback4.setFranchise(franchise);
        feedback4.setAdminReply("Thank you so much for your kind words! We're glad you enjoyed your experience.");
        feedback4.setRepliedAt(LocalDateTime.now().minusDays(5));
        feedback4.setRepliedBy("manager@" + franchise.getFranchiseCode().toLowerCase() + ".com");
        feedback4.setSubmittedAt(LocalDateTime.now().minusDays(7));

        // Feedback 5 - 2 stars
        Feedback feedback5 = new Feedback();
        feedback5.setCustomerName("Vikram Singh");
        feedback5.setCustomerEmail("vikram.s@example.com");
        feedback5.setCustomerPhone("9876543214");
        feedback5.setBillNumber("B" + (1000 + random.nextInt(9000)));
        feedback5.setRating(Rating.TWO_STARS);
        feedback5.setComments("Disappointed with the quality today. Burger was cold and the service was slow.");
        feedback5.setWouldRecommend(false);
        feedback5.setServiceRating(2);
        feedback5.setFoodRating(2);
        feedback5.setCleanlinessRating(3);
        feedback5.setValueRating(2);
        feedback5.setFranchise(franchise);
        feedback5.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

        // Feedback 6 - 4 stars
        Feedback feedback6 = new Feedback();
        feedback6.setCustomerName("Anjali Desai");
        feedback6.setCustomerEmail("anjali.d@example.com");
        feedback6.setCustomerPhone("9876543215");
        feedback6.setBillNumber("B" + (1000 + random.nextInt(9000)));
        feedback6.setRating(Rating.FOUR_STARS);
        feedback6.setComments("Great place for family dinner. Kids loved the happy meal toys!");
        feedback6.setWouldRecommend(true);
        feedback6.setServiceRating(4);
        feedback6.setFoodRating(4);
        feedback6.setCleanlinessRating(5);
        feedback6.setValueRating(4);
        feedback6.setFranchise(franchise);
        feedback6.setSubmittedAt(LocalDateTime.now().minusDays(random.nextInt(30)));

        List<Feedback> feedbacks = Arrays.asList(feedback1, feedback2, feedback3, feedback4, feedback5, feedback6);
        feedbackRepository.saveAll(feedbacks);
    }
}