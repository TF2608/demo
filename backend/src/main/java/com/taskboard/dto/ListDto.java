package com.taskboard.dto;

import java.util.List;

public record ListDto(
        Long id,
        String title,
        int position,
        List<CardDto> cards
) {
}
