package com.taskboard.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateListRequest(
        @NotBlank String title
) {
}
