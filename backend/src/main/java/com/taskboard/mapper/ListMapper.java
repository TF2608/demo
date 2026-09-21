package com.taskboard.mapper;

import com.taskboard.dto.ListDto;
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
}
