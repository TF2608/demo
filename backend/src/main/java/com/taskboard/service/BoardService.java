package com.taskboard.service;

import com.taskboard.dto.BoardDto;
import com.taskboard.dto.CardDto;
import com.taskboard.dto.ListDto;
import com.taskboard.entity.Card;
import com.taskboard.entity.TaskList;
import com.taskboard.mapper.CardMapper;
import com.taskboard.mapper.ListMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;
    private final ListMapper listMapper;
    private final CardMapper cardMapper;

    @Transactional(readOnly = true)
    public BoardDto getBoard() {
        List<TaskList> lists = taskListRepository.findAllByOrderByPosition();
        Map<Long, List<CardDto>> cardsByListId = cardRepository.findAllByOrderByListIdAscPositionAsc().stream()
                .map(cardMapper::toDto)
                .collect(Collectors.groupingBy(CardDto::listId));

        List<ListDto> listDtos = lists.stream()
                .map(list -> listMapper.toDto(list, cardsByListId.getOrDefault(list.getId(), List.of())))
                .toList();

        return new BoardDto(listDtos);
    }
}
