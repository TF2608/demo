package com.taskboard.service;

import com.taskboard.dto.CardDto;
import com.taskboard.dto.CreateListRequest;
import com.taskboard.dto.ListDto;
import com.taskboard.dto.ReorderListsRequest;
import com.taskboard.dto.UpdateListRequest;
import com.taskboard.entity.TaskList;
import com.taskboard.exception.NotFoundException;
import com.taskboard.mapper.CardMapper;
import com.taskboard.mapper.ListMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListService {

    private final TaskListRepository taskListRepository;
    private final CardRepository cardRepository;
    private final ListMapper listMapper;
    private final CardMapper cardMapper;

    @Transactional
    public ListDto createList(CreateListRequest request) {
        int nextPosition = taskListRepository.findAllByOrderByPosition().size();
        TaskList list = new TaskList(request.title(), nextPosition);
        taskListRepository.save(list);
        return listMapper.toDto(list, List.of());
    }

    @Transactional
    public ListDto renameList(Long listId, UpdateListRequest request) {
        TaskList list = findListOrThrow(listId);
        list.setTitle(request.title());
        taskListRepository.save(list);
        List<CardDto> cards = cardRepository.findByListIdOrderByPosition(listId).stream()
                .map(cardMapper::toDto)
                .toList();
        return listMapper.toDto(list, cards);
    }

    @Transactional
    public void deleteList(Long listId) {
        TaskList list = findListOrThrow(listId);
        taskListRepository.delete(list);
    }

    @Transactional
    public void reorderLists(ReorderListsRequest request) {
        List<TaskList> lists = taskListRepository.findAllById(request.orderedListIds());
        for (int index = 0; index < request.orderedListIds().size(); index++) {
            Long id = request.orderedListIds().get(index);
            int finalIndex = index;
            lists.stream()
                    .filter(list -> list.getId().equals(id))
                    .findFirst()
                    .ifPresent(list -> list.setPosition(finalIndex));
        }
        taskListRepository.saveAll(lists);
    }

    private TaskList findListOrThrow(Long listId) {
        return taskListRepository.findById(listId)
                .orElseThrow(() -> new NotFoundException("List not found: " + listId));
    }
}
