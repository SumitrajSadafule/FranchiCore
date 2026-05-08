package com.macs.franchise.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponse {
	private Long id;
	private String name;
	private String description;
	private BigDecimal price;
	private String category;
	private String imageUrl;
	private boolean isAvailable;
	private boolean isVegetarian;
	private boolean isSpicy;
	private Integer calories;
	private Integer preparationTimeMinutes;
	private Long franchiseId;
	private String franchiseName;
	private LocalDateTime createdAt;

}