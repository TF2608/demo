package com.taskboard.service;

import com.taskboard.dto.BoardDto;
import com.taskboard.dto.CardDto;
import com.taskboard.entity.TaskList;
import com.taskboard.mapper.CardMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.TaskListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BoardService {

    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;
    private final CardMapper cardMapper;

    public BoardService(TaskListRepository taskListRepository, CardRepository cardRepository, CardMapper cardMapper) {
        this.taskListRepository = taskListRepository;
        this.cardRepository = cardRepository;
        this.cardMapper = cardMapper;
    }

    public BoardDto getBoard() {
        List<BoardDto.ListWithCardsDto> lists = taskListRepository.findAllByOrderByPositionAsc().stream()
                .map(this::toListWithCards)
                .toList();
        return new BoardDto(lists);
    }

    private BoardDto.ListWithCardsDto toListWithCards(TaskList list) {
        List<CardDto> cards = cardRepository.findByListIdOrderByPositionAsc(list.getId()).stream()
                .map(cardMapper::toDto)
                .toList();
        return new BoardDto.ListWithCardsDto(list.getId(), list.getTitle(), list.getPosition(), cards);
    }
}
