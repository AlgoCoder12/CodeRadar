package com.AlgoAlert.CodeRadar.enums;

public enum Difficulty {
    Easy(10),
    Medium(20),
    Hard(30);

    private final int points;

    Difficulty(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }

    public static Difficulty fromRating(int rating) {
        if (rating <= 1000) return Easy;
        if (rating <= 1400) return Medium;
        return Hard;
    }
} 