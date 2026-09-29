package com.taskboard.controller;

import com.taskboard.dto.ListDto;
import com.taskboard.dto.ListUpdateRequest;
import com.taskboard.service.ListService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class ListController {

    private final ListService listService;

    public ListController(ListService listService) {
        this.listService = listService;
    }

    @GetMapping
    public List<ListDto> getLists() {
        return listService.getLists();
    }

    @GetMapping("/{id}")
    public ListDto getList(@PathVariable Long id) {
        return listService.getList(id);
    }

    @PatchMapping("/{id}")
    public ListDto updateList(@PathVariable Long id, @RequestBody ListUpdateRequest request) {
        return listService.updateList(id, request);
    }
}
