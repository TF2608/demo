package com.taskboard.dto;

public record CardDto(
        Long id,
        Long listId,
        String text,
        boolean done,
        String priority,
        int position
) {
}
