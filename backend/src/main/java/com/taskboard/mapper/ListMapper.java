package com.taskboard.mapper;

import com.taskboard.dto.ListDto;
import com.taskboard.dto.ListUpdateRequest;
import com.taskboard.entity.TaskList;
import org.springframework.stereotype.Component;

@Component
public class ListMapper {

    public ListDto toDto(TaskList list) {
        return new ListDto(
                list.getId(),
                list.getTitle(),
                list.getPosition(),
                list.getCreatedAt(),
                list.getUpdatedAt()
        );
    }

    public void applyUpdate(TaskList list, ListUpdateRequest request) {
        if (request.title() != null) {
            list.setTitle(request.title());
        }
    }
}
