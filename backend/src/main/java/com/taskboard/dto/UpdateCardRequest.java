package com.taskboard.dto;

import jakarta.validation.constraints.Pattern;

public record UpdateCardRequest(
        String text,
        Boolean done,
        @Pattern(regexp = "high|mid|low") String priority
) {
}
