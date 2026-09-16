package com.taskboard.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record ReorderListsRequest(
        @NotEmpty List<Long> orderedListIds
) {
}
