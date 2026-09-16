package com.taskboard.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCardRequest(
        @NotBlank String text
) {
}
