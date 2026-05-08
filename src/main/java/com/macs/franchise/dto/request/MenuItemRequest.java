package com.macs.franchise.dto.request;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequest {
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

}