package com.taskboard.entity;

public enum Priority {
    HIGH("high"),
    MID("mid"),
    LOW("low");

    private final String value;

    Priority(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Priority fromValue(String value) {
        for (Priority priority : values()) {
            if (priority.value.equals(value)) {
                return priority;
            }
        }
        throw new IllegalArgumentException("Unknown priority: " + value);
    }
}
