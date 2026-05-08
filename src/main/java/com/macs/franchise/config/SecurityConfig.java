package com.macs.franchise.config;

import com.macs.franchise.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final UserDetailsServiceImpl userDetailsService;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(UserDetailsServiceImpl userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
		this.userDetailsService = userDetailsService;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						// Public endpoints - FIXED: Removed trailing /** patterns
						.requestMatchers("/auth/login").permitAll().requestMatchers("/auth/register").permitAll()
						.requestMatchers("/test-auth/**").permitAll().requestMatchers("/health/check").permitAll()
						.requestMatchers("/ping").permitAll().requestMatchers("/simple/ping").permitAll()
						.requestMatchers("/menu").permitAll().requestMatchers("/menu/**").permitAll()
						.requestMatchers("/franchises").permitAll().requestMatchers("/franchises/**").permitAll()
						.requestMatchers("/jobs/open").permitAll().requestMatchers("/jobs/search").permitAll()
						.requestMatchers("/jobs/location/**").permitAll().requestMatchers("/jobs/type/**").permitAll()
						.requestMatchers("/jobs/apply").permitAll().requestMatchers("/jobs/{id}").permitAll()
						.requestMatchers("/franchise-applications/submit").permitAll()
						.requestMatchers("/feedback/submit").permitAll().requestMatchers("/feedback/franchise/*/public")
						.permitAll().requestMatchers("/feedback/franchise/*/average-rating").permitAll()
						.requestMatchers("/feedback/franchise/*/rating-stats").permitAll()
						.requestMatchers("/feedback/franchise/*/rating-distribution").permitAll()
						.requestMatchers("/feedback/franchise/*/recent").permitAll().requestMatchers("/error")
						.permitAll().requestMatchers("/owner/**").authenticated()
						// All other endpoints require authentication
						.anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
		configuration.setExposedHeaders(List.of("Authorization"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	public UserDetailsServiceImpl getUserDetailsService() {
		return userDetailsService;
	}
}