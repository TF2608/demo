package com.taskboard.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record MoveCardRequest(
        @NotNull Long targetListId,
        @NotNull @PositiveOrZero Integer targetPosition
) {
}
