package com.taskboard.dto;

import java.time.OffsetDateTime;

public record ListDto(
        Long id,
        String title,
        Integer position,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
