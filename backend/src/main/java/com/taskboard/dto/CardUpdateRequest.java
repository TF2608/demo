package com.taskboard.dto;

import java.time.LocalDate;

public record CardUpdateRequest(
        String text,
        Boolean done,
        String priority,
        Long listId,
        Integer position,
        LocalDate dueDate
) {
}
