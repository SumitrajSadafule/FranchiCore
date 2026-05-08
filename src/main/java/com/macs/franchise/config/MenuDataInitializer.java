package com.macs.franchise.config;

import com.macs.franchise.model.MenuItem;
import com.macs.franchise.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@Order(2) // Run after DataInitializer
public class MenuDataInitializer implements CommandLineRunner {

	@Autowired
	private MenuRepository menuRepository;

	@Override
	public void run(String... args) throws Exception {
		System.out.println("===== CHECKING AND INITIALIZING MENU ITEMS =====");

		if (menuRepository.count() == 0) {
			List<MenuItem> menuItems = Arrays.asList(
					// Burgers
					new MenuItem("Classic Mac Burger",
							"100% pure beef patty with lettuce, cheese, pickles, onions and our special sauce",
							new BigDecimal("5.99"), "Burgers"),
					new MenuItem("Double Mac Burger",
							"Two 100% pure beef patties with lettuce, cheese, pickles, onions and our special sauce",
							new BigDecimal("8.99"), "Burgers"),
					new MenuItem("Crispy Chicken Burger", "Crispy chicken fillet with lettuce and mayonnaise",
							new BigDecimal("6.49"), "Burgers"),

					// Fries
					new MenuItem("Regular Fries", "Golden crispy fries, lightly salted", new BigDecimal("2.49"),
							"Fries"),
					new MenuItem("Large Fries", "Large portion of our famous golden fries", new BigDecimal("3.49"),
							"Fries"),
					new MenuItem("Cheese Fries", "Fries topped with melted cheese sauce", new BigDecimal("3.99"),
							"Fries"),

					// Beverages
					new MenuItem("Coca-Cola", "Regular Coca-Cola", new BigDecimal("1.99"), "Beverages"),
					new MenuItem("Diet Coke", "Sugar-free Coca-Cola", new BigDecimal("1.99"), "Beverages"),
					new MenuItem("Sprite", "Lemon-lime soda", new BigDecimal("1.99"), "Beverages"),
					new MenuItem("Milkshake", "Vanilla, Chocolate or Strawberry", new BigDecimal("3.99"), "Beverages"),

					// Desserts
					new MenuItem("Apple Pie", "Warm apple pie with a flaky crust", new BigDecimal("2.49"), "Desserts"),
					new MenuItem("Chocolate Sundae", "Creamy vanilla soft serve with chocolate topping",
							new BigDecimal("2.99"), "Desserts"),
					new MenuItem("McFlurry", "Vanilla soft serve mixed with your choice of toppings",
							new BigDecimal("3.49"), "Desserts"),

					// Breakfast
					new MenuItem("Egg McMuffin", "Egg, cheese and Canadian bacon on a toasted English muffin",
							new BigDecimal("3.99"), "Breakfast"),
					new MenuItem("Hotcakes", "Fluffy hotcakes with butter and syrup", new BigDecimal("4.49"),
							"Breakfast"),
					new MenuItem("Sausage Burrito", "Scrambled eggs, sausage, cheese and peppers in a tortilla",
							new BigDecimal("2.99"), "Breakfast"));

			// Set additional properties for some items
			for (int i = 0; i < menuItems.size(); i++) {
				MenuItem item = menuItems.get(i);

				// Set vegetarian flag
				if (item.getName().contains("Fries") || item.getName().contains("Coke")
						|| item.getName().contains("Sprite") || item.getName().contains("Apple Pie")
						|| item.getName().contains("Sundae") || item.getName().contains("McFlurry")
						|| item.getName().contains("Hotcakes")) {
					item.setVegetarian(true);
				}

				// Set spicy flag
				if (item.getName().contains("Spicy") || item.getName().contains("Sausage")) {
					item.setSpicy(true);
				}

				// Set calories
				if (item.getCategory().equals("Burgers")) {
					item.setCalories(500 + (i * 50));
				} else if (item.getCategory().equals("Fries")) {
					item.setCalories(300 + (i * 20));
				} else if (item.getCategory().equals("Beverages")) {
					item.setCalories(150);
				} else if (item.getCategory().equals("Desserts")) {
					item.setCalories(400);
				}

				// Set preparation time
				item.setPreparationTimeMinutes(5 + (i % 10));
			}

			menuRepository.saveAll(menuItems);
			System.out.println("✅ Added " + menuItems.size() + " sample menu items");
		} else {
			System.out.println("ℹ️ Menu items already exist: " + menuRepository.count());
		}

		System.out.println("===== MENU INITIALIZATION COMPLETE =====");
	}
}