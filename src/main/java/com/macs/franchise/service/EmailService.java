package com.macs.franchise.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private TemplateEngine templateEngine;

	@Value("${app.email.sender}")
	private String fromEmail;

	@Value("${app.email.sender-name}")
	private String fromName;

	/**
	 * Send HTML email
	 * 
	 * @param to           - Recipient email address
	 * @param subject      - Email subject
	 * @param templateName - Thymeleaf template name (without .html)
	 * @param context      - Template variables
	 */
	public void sendHtmlEmail(String to, String subject, String templateName, Context context) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			// Set from address only, then set personal name separately
			helper.setFrom(fromEmail);
			helper.setTo(to);
			helper.setSubject(subject);

			// Set personal name in the message header
			if (fromName != null && !fromName.isEmpty()) {
				message.setFrom(new jakarta.mail.internet.InternetAddress(fromEmail, fromName));
			}

			String htmlContent = templateEngine.process(templateName, context);
			helper.setText(htmlContent, true);

			mailSender.send(message);
			logger.info("Email sent successfully to: {}", to);
		} catch (Exception e) {
			logger.error("Failed to send email to: {}", to, e);
			e.printStackTrace(); // Print full stack trace for debugging
			throw new RuntimeException("Failed to send email: " + e.getMessage());
		}
	}

	// Send simple text email (fallback)
	public void sendTextEmail(String to, String subject, String text) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			// Set from address only
			helper.setFrom(fromEmail);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(text, false);

			// Set personal name in the message header
			if (fromName != null && !fromName.isEmpty()) {
				message.setFrom(new jakarta.mail.internet.InternetAddress(fromEmail, fromName));
			}

			mailSender.send(message);
			logger.info("Text email sent successfully to: {}", to);
		} catch (Exception e) {
			logger.error("Failed to send text email to: {}", to, e);
			e.printStackTrace();
			throw new RuntimeException("Failed to send email: " + e.getMessage());
		}
	}
}