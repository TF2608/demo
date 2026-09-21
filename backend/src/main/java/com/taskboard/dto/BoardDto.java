package com.taskboard.dto;

import java.util.List;

public record BoardDto(
        List<ListWithCardsDto> lists
) {
    public record ListWithCardsDto(
            Long id,
            String title,
            Integer position,
            List<CardDto> cards
    ) {
    }
}
