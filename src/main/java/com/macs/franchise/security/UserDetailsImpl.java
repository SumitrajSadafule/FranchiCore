package com.macs.franchise.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.macs.franchise.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Custom UserDetails implementation for Spring Security Wraps our User entity
 * for security context
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {
	private static final long serialVersionUID = 1L;

	private Long id;
	private String username;
	private String email;
	private String firstName;
	private String lastName;

	@JsonIgnore
	private String password;

	private Collection<? extends GrantedAuthority> authorities;
	private Long franchiseId;
	private boolean enabled;
	private boolean accountNonExpired;
	private boolean accountNonLocked;
	private boolean credentialsNonExpired;

	// Build UserDetailsImpl from User entity
	// converts User to UserDetailsImpl
	public static UserDetailsImpl build(User user) {
		List<GrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());

		Long franchiseId = null;

		return new UserDetailsImpl(user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(),
				user.getLastName(), user.getPassword(), authorities, franchiseId, user.isEnabled(),
				user.isAccountNonExpired(), user.isAccountNonLocked(), user.isCredentialsNonExpired());
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public boolean isAccountNonExpired() {
		return accountNonExpired;
	}

	@Override
	public boolean isAccountNonLocked() {
		return accountNonLocked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return credentialsNonExpired;
	}

	@Override
	public boolean isEnabled() {
		return enabled;
	}
}