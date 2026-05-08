package com.macs.franchise.config;

import com.macs.franchise.model.Role;
import com.macs.franchise.model.User;
import com.macs.franchise.model.enums.RoleType;
import com.macs.franchise.repository.RoleRepository;
import com.macs.franchise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		System.out.println("===== CHECKING AND INITIALIZING DEFAULT ROLES =====");

		// Create default roles if they don't exist
		createRoleIfNotFound(RoleType.ROLE_SUPER_ADMIN);
		createRoleIfNotFound(RoleType.ROLE_FRANCHISE_OWNER);
		createRoleIfNotFound(RoleType.ROLE_CUSTOMER);
		createRoleIfNotFound(RoleType.ROLE_JOB_SEEKER);
		createRoleIfNotFound(RoleType.ROLE_APPLICANT);

		System.out.println("===== ROLES INITIALIZATION COMPLETE =====");

		// Count and display roles
		long roleCount = roleRepository.count();
		System.out.println("Total roles in database: " + roleCount);

		// Create a test user if none exists
		createTestUserIfNotFound();
	}

	private void createRoleIfNotFound(RoleType roleType) {
		try {
			if (!roleRepository.existsByName(roleType)) {
				Role role = new Role(roleType);
				roleRepository.save(role);
				System.out.println("Created role: " + roleType.name());
			} else {
				System.out.println("Role already exists: " + roleType.name());
			}
		} catch (Exception e) {
			System.out.println("Error creating role " + roleType.name() + ": " + e.getMessage());
		}
	}

	private void createTestUserIfNotFound() {
		try {
			// Check if test user already exists
			if (!userRepository.existsByUsername("admin") && !userRepository.existsByEmail("admin@macs.com")) {

				// Create admin user
				User adminUser = new User();
				adminUser.setUsername("admin");
				adminUser.setEmail("admin@macs.com");
				adminUser.setFirstName("Super");
				adminUser.setLastName("Admin");
				adminUser.setPhone("1234567890");
				adminUser.setPassword(passwordEncoder.encode("admin123"));

				// Assign SUPER_ADMIN role
				Set<Role> roles = new HashSet<>();
				Role adminRole = roleRepository.findByName(RoleType.ROLE_SUPER_ADMIN)
						.orElseThrow(() -> new RuntimeException("Error: Admin role not found."));
				roles.add(adminRole);
				adminUser.setRoles(roles);

				userRepository.save(adminUser);
				System.out.println("✅ Created admin user: admin / admin123");

				// Create test franchise owner
				User ownerUser = new User();
				ownerUser.setUsername("owner");
				ownerUser.setEmail("owner@macs.com");
				ownerUser.setFirstName("Franchise");
				ownerUser.setLastName("Owner");
				ownerUser.setPhone("0987654321");
				ownerUser.setPassword(passwordEncoder.encode("owner123"));

				// Assign FRANCHISE_OWNER role
				Set<Role> ownerRoles = new HashSet<>();
				Role ownerRole = roleRepository.findByName(RoleType.ROLE_FRANCHISE_OWNER)
						.orElseThrow(() -> new RuntimeException("Error: Owner role not found."));
				ownerRoles.add(ownerRole);
				ownerUser.setRoles(ownerRoles);

				userRepository.save(ownerUser);
				System.out.println("✅ Created owner user: owner / owner123");

				// Create test customer
				User customerUser = new User();
				customerUser.setUsername("customer");
				customerUser.setEmail("customer@example.com");
				customerUser.setFirstName("Test");
				customerUser.setLastName("Customer");
				customerUser.setPhone("5555555555");
				customerUser.setPassword(passwordEncoder.encode("customer123"));

				// Assign CUSTOMER role
				Set<Role> customerRoles = new HashSet<>();
				Role customerRole = roleRepository.findByName(RoleType.ROLE_CUSTOMER)
						.orElseThrow(() -> new RuntimeException("Error: Customer role not found."));
				customerRoles.add(customerRole);
				customerUser.setRoles(customerRoles);

				userRepository.save(customerUser);
				System.out.println("✅ Created customer user: customer / customer123");

			} else {
				System.out.println("ℹ️ Test users already exist");
			}
		} catch (Exception e) {
			System.out.println("Error creating test users: " + e.getMessage());
		}
	}
}