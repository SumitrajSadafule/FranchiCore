package com.macs.franchise.config;

import com.macs.franchise.model.Job;
import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.JobType;
import com.macs.franchise.model.enums.JobStatus;
import com.macs.franchise.repository.JobRepository;
import com.macs.franchise.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@Order(3) // Run after franchises are created
public class JobDataInitializer implements CommandLineRunner {

	@Autowired
	private JobRepository jobRepository;

	@Autowired
	private FranchiseRepository franchiseRepository;

	@Override
	public void run(String... args) throws Exception {
		System.out.println("===== CHECKING AND INITIALIZING JOBS =====");

		if (jobRepository.count() == 0) {
			List<Franchise> franchises = franchiseRepository.findAll();

			if (franchises.isEmpty()) {
				System.out.println("⚠️ No franchises found. Skipping job initialization.");
				return;
			}

			// Create sample jobs
			Job job1 = new Job("Cashier",
					"We are looking for a friendly cashier to handle customer transactions and provide excellent service.",
					JobType.FULL_TIME, franchises.get(0).getCity(), franchises.get(0));
			job1.setRequirements(
					"• Previous cashier experience preferred\n• Basic math skills\n• Friendly attitude\n• Ability to stand for long periods");
			job1.setSalaryRange("₹15,000 - ₹18,000 per month");
			job1.setExperienceRequired("0-1 years");
			job1.setApplicationDeadline(LocalDateTime.now().plusDays(30));
			job1.setPositionsAvailable(2);

			Job job2 = new Job("Kitchen Staff", "Join our kitchen team to prepare delicious meals for our customers.",
					JobType.FULL_TIME, franchises.get(0).getCity(), franchises.get(0));
			job2.setRequirements(
					"• Previous kitchen experience\n• Food safety knowledge\n• Team player\n• Ability to work in fast-paced environment");
			job2.setSalaryRange("₹16,000 - ₹20,000 per month");
			job2.setExperienceRequired("1-2 years");
			job2.setApplicationDeadline(LocalDateTime.now().plusDays(45));
			job2.setPositionsAvailable(3);

			Job job3 = new Job("Weekend Crew", "Looking for energetic staff to join our weekend team.",
					JobType.PART_TIME, franchises.get(1).getCity(), franchises.get(1));
			job3.setRequirements(
					"• Available on weekends\n• Student friendly\n• Quick learner\n• Good communication skills");
			job3.setSalaryRange("₹12,000 - ₹15,000 per month");
			job3.setExperienceRequired("Freshers welcome");
			job3.setApplicationDeadline(LocalDateTime.now().plusDays(60));
			job3.setPositionsAvailable(4);

			Job job4 = new Job("Shift Manager",
					"We are seeking an experienced Shift Manager to oversee operations during peak hours.",
					JobType.FULL_TIME, franchises.get(2).getCity(), franchises.get(2));
			job4.setRequirements(
					"• Previous supervisory experience\n• Leadership skills\n• Problem-solving ability\n• Food safety certification preferred");
			job4.setSalaryRange("₹25,000 - ₹30,000 per month");
			job4.setExperienceRequired("2-3 years");
			job4.setApplicationDeadline(LocalDateTime.now().plusDays(20));
			job4.setPositionsAvailable(1);

			Job job5 = new Job("Cleanliness Associate", "Maintain cleanliness and hygiene standards in our restaurant.",
					JobType.FULL_TIME, franchises.get(3).getCity(), franchises.get(3));
			job5.setRequirements(
					"• Attention to detail\n• Ability to work early mornings\n• Physical stamina\n• No experience required - training provided");
			job5.setSalaryRange("₹14,000 - ₹16,000 per month");
			job5.setExperienceRequired("Freshers welcome");
			job5.setApplicationDeadline(LocalDateTime.now().plusDays(90));
			job5.setPositionsAvailable(5);

			Job job6 = new Job("Delivery Partner", "Join our delivery team and serve customers at their doorstep.",
					JobType.PART_TIME, franchises.get(4).getCity(), franchises.get(4));
			job6.setRequirements(
					"• Valid driver's license\n• Own vehicle preferred\n• Good knowledge of local area\n• Smartphone with internet");
			job6.setSalaryRange("₹18,000 - ₹22,000 per month (including incentives)");
			job6.setExperienceRequired("0-1 years");
			job6.setApplicationDeadline(LocalDateTime.now().plusDays(30));
			job6.setPositionsAvailable(6);

			List<Job> jobs = Arrays.asList(job1, job2, job3, job4, job5, job6);

			// Set additional common properties
			for (int i = 0; i < jobs.size(); i++) {
				Job job = jobs.get(i);
				job.setStatus(JobStatus.OPEN);
				job.setPostedBy("System");
			}

			jobRepository.saveAll(jobs);
			System.out.println("✅ Added " + jobs.size() + " sample jobs");
		} else {
			System.out.println("ℹ️ Jobs already exist: " + jobRepository.count());
		}

		System.out.println("===== JOBS INITIALIZATION COMPLETE =====");
	}
}