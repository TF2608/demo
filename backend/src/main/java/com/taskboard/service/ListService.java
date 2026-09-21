package com.taskboard.service;

import com.taskboard.dto.ListDto;
import com.taskboard.entity.TaskList;
import com.taskboard.exception.NotFoundException;
import com.taskboard.mapper.ListMapper;
import com.taskboard.repository.TaskListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ListService {

    private final TaskListRepository taskListRepository;
    private final ListMapper listMapper;

    public ListService(TaskListRepository taskListRepository, ListMapper listMapper) {
        this.taskListRepository = taskListRepository;
        this.listMapper = listMapper;
    }

    public List<ListDto> getLists() {
        return taskListRepository.findAllByOrderByPositionAsc().stream()
                .map(listMapper::toDto)
                .toList();
    }

    public ListDto getList(Long id) {
        TaskList list = taskListRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("List not found: " + id));
        return listMapper.toDto(list);
    }
}
