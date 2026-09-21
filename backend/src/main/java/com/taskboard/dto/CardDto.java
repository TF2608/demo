package com.taskboard.dto;

import java.time.OffsetDateTime;

public record CardDto(
        Long id,
        Long listId,
        String text,
        Boolean done,
        String priority,
        Integer position,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
