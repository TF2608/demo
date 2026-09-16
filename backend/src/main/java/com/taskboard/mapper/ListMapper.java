package com.taskboard.mapper;

import com.taskboard.dto.CardDto;
import com.taskboard.dto.ListDto;
import com.taskboard.entity.TaskList;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ListMapper {

    public ListDto toDto(TaskList list, List<CardDto> cards) {
        return new ListDto(
                list.getId(),
                list.getTitle(),
                list.getPosition(),
                cards
        );
    }
}
