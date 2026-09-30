package com.taskboard.dto;

import jakarta.validation.constraints.NotNull;

public record CardMoveRequest(
        @NotNull Long listId,
        @NotNull Integer position
) {
}
