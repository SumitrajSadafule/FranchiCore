package com.macs.franchise.config;

import com.macs.franchise.model.Franchise;
import com.macs.franchise.model.enums.FranchiseStatus;
import com.macs.franchise.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@Order(1)
public class FranchiseDataInitializer implements CommandLineRunner {

	@Autowired
	private FranchiseRepository franchiseRepository;

	@Override
	public void run(String... args) throws Exception {
		System.out.println("===== CHECKING AND INITIALIZING FRANCHISES =====");

		if (franchiseRepository.count() == 0) {
			List<Franchise> franchises = Arrays.asList(
					// Mumbai franchises
					new Franchise("MAC's Downtown Mumbai", "MAC001", "Mumbai", "022-12345678",
							"downtown.mumbai@macs.com"),
					new Franchise("MAC's Andheri Mumbai", "MAC002", "Mumbai", "022-23456789",
							"andheri.mumbai@macs.com"),
					new Franchise("MAC's Bandra Mumbai", "MAC003", "Mumbai", "022-34567890", "bandra.mumbai@macs.com"),

					// Delhi/NCR franchises
					new Franchise("MAC's Connaught Place Delhi", "MAC004", "Delhi", "011-12345678",
							"cp.delhi@macs.com"),
					new Franchise("MAC's Noida", "MAC005", "Noida", "0120-123456", "noida@macs.com"),
					new Franchise("MAC's Gurgaon", "MAC011", "Gurgaon", "0124-123456", "gurgaon@macs.com"),

					// Other cities
					new Franchise("MAC's Indiranagar Bangalore", "MAC006", "Bangalore", "080-12345678",
							"indiranagar.blr@macs.com"),
					new Franchise("MAC's Koramangala Bangalore", "MAC012", "Bangalore", "080-23456789",
							"koramangala.blr@macs.com"),
					new Franchise("MAC's Koregaon Park Pune", "MAC007", "Pune", "020-12345678", "kp.pune@macs.com"),
					new Franchise("MAC's T Nagar Chennai", "MAC008", "Chennai", "044-12345678",
							"tnagar.chennai@macs.com"),
					new Franchise("MAC's Park Street Kolkata", "MAC009", "Kolkata", "033-12345678",
							"parkstreet.kolkata@macs.com"),
					new Franchise("MAC's Jubilee Hills Hyderabad", "MAC010", "Hyderabad", "040-12345678",
							"jubileehills.hyd@macs.com"));

			// Set additional details for each franchise
			for (int i = 0; i < franchises.size(); i++) {
				Franchise f = franchises.get(i);
				f.setAddressLine1("Shop No. " + (i + 1) + ", Main Road");

				// Set state based on city
				if (f.getCity().equals("Mumbai")) {
					f.setState("Maharashtra");
				} else if (f.getCity().equals("Pune")) {
					f.setState("Maharashtra");
				} else if (f.getCity().equals("Delhi") || f.getCity().equals("Noida")
						|| f.getCity().equals("Gurgaon")) {
					f.setState("Delhi NCR");
				} else if (f.getCity().equals("Bangalore")) {
					f.setState("Karnataka");
				} else if (f.getCity().equals("Chennai")) {
					f.setState("Tamil Nadu");
				} else if (f.getCity().equals("Kolkata")) {
					f.setState("West Bengal");
				} else if (f.getCity().equals("Hyderabad")) {
					f.setState("Telangana");
				}

				f.setPostalCode("40000" + (i + 1));
				f.setOpeningDate(LocalDateTime.now().minusMonths(i));
				f.setOperatingHours("Mon-Sun: 10:00 AM - 11:00 PM");
				f.setManagerName("Manager " + (i + 1));
				f.setManagerPhone(f.getPhone());
				f.setManagerEmail("manager" + (i + 1) + "@macs.com");
				f.setLatitude(19.0760 + (i * 0.01));
				f.setLongitude(72.8777 + (i * 0.01));
				f.setStatus(FranchiseStatus.ACTIVE);
			}

			franchiseRepository.saveAll(franchises);
			System.out.println("✅ Added " + franchises.size() + " sample franchises");
		} else {
			System.out.println("ℹ️ Franchises already exist: " + franchiseRepository.count());

			// Optional: Update existing franchises if needed
			List<Franchise> allFranchises = franchiseRepository.findAll();
			System.out.println("Current franchises in DB:");
			for (Franchise f : allFranchises) {
				System.out.println(" - " + f.getFranchiseName() + " (" + f.getCity() + ")");
			}
		}

		System.out.println("===== FRANCHISE INITIALIZATION COMPLETE =====");
	}
}