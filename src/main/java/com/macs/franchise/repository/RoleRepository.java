package com.macs.franchise.repository;

import com.macs.franchise.model.Role;
import com.macs.franchise.model.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findByName(RoleType name);

	boolean existsByName(RoleType name);
}