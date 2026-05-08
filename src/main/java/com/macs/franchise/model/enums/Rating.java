package com.macs.franchise.model.enums;

public enum Rating {
    ONE_STAR(1, "Poor"),
    TWO_STARS(2, "Fair"),
    THREE_STARS(3, "Good"),
    FOUR_STARS(4, "Very Good"),
    FIVE_STARS(5, "Excellent");
    
    private final int value;
    private final String description;
    
    Rating(int value, String description) {
        this.value = value;
        this.description = description;
    }
    
    public int getValue() { return value; }
    public String getDescription() { return description; }
    
    public static Rating fromValue(int value) {
        for (Rating rating : Rating.values()) {
            if (rating.getValue() == value) {
                return rating;
            }
        }
        throw new IllegalArgumentException("Invalid rating value: " + value);
    }
}