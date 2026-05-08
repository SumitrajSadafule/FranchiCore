package com.macs.franchise.config;

import com.macs.franchise.security.JwtUtils;
import com.macs.franchise.security.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	@Autowired
	private JwtUtils jwtUtils;

	@Autowired
	private UserDetailsServiceImpl userDetailsService;

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {

		logger.info("=== JWT FILTER STARTED for: {} ===", request.getRequestURI());

		try {
			String jwt = parseJwt(request);
			logger.info("JWT Token extracted: {}", jwt != null ? "Yes" : "No");

			if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
				String username = jwtUtils.getUserNameFromJwtToken(jwt);
				logger.info("JWT Token validated for user: {}", username);

				UserDetails userDetails = userDetailsService.loadUserByUsername(username);
				logger.info("User authorities: {}", userDetails.getAuthorities());

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userDetails, null, userDetails.getAuthorities());

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(authentication);
				logger.info("Authentication set in SecurityContext for user: {}", username);
			} else {
				logger.info("No valid JWT token found, continuing with anonymous");
			}
		} catch (Exception e) {
			logger.error("Cannot set user authentication: {}", e.getMessage());
		}

		logger.info("=== JWT FILTER COMPLETED for: {} ===", request.getRequestURI());
		filterChain.doFilter(request, response);
	}

	private String parseJwt(HttpServletRequest request) {
		String headerAuth = request.getHeader("Authorization");
		logger.info("Authorization header: {}", headerAuth);

		if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
			return headerAuth.substring(7);
		}

		return null;
	}
}