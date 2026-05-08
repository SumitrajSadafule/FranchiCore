package com.macs.franchise.repository;

import com.macs.franchise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	// Find user by username
	Optional<User> findByUsername(String username);

	// Find user by email
	Optional<User> findByEmail(String email);

	// Check if username exists
	boolean existsByUsername(String username);

	// Check if email exists
	boolean existsByEmail(String email);

	// Find user by username or email (for login)
	@Query("SELECT u FROM User u WHERE u.username = :login OR u.email = :login")
	Optional<User> findByUsernameOrEmail(@Param("login") String username, @Param("login") String email);

	// Load user with franchise in one query (more efficient)
	@Query("SELECT u FROM User u LEFT JOIN FETCH u.franchise WHERE u.id = :userId")
	Optional<User> findByIdWithFranchise(@Param("userId") Long userId);
}