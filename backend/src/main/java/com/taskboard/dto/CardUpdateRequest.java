package com.taskboard.dto;

public record CardUpdateRequest(
        String text,
        Boolean done,
        String priority,
        Long listId,
        Integer position
) {
}
