package com.taskboard.dto;

import java.util.List;

public record BoardDto(
        List<ListDto> lists
) {
}
