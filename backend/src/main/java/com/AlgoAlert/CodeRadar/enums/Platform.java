package com.AlgoAlert.CodeRadar.enums;


public enum Platform {
    LEETCODE("LeetCode"),
    CODEFORCES("Codeforces"),
    GEEKSFORGEEKS("GeeksForGeeks"),
    ATCODER("AtCoder"),
    CODECHEF("CodeChef"),
    HACKERRANK("HackerRank"),
    HACKEREARTH("HackerEarth");

    private final String displayName;

    Platform(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 