package com.taskboard.controller;

import com.taskboard.dto.CreateListRequest;
import com.taskboard.dto.ListDto;
import com.taskboard.dto.ReorderListsRequest;
import com.taskboard.dto.UpdateListRequest;
import com.taskboard.service.ListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ListController {

    private final ListService listService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ListDto createList(@Valid @RequestBody CreateListRequest request) {
        return listService.createList(request);
    }

    @PatchMapping("/{listId}")
    public ListDto renameList(@PathVariable Long listId, @Valid @RequestBody UpdateListRequest request) {
        return listService.renameList(listId, request);
    }

    @DeleteMapping("/{listId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteList(@PathVariable Long listId) {
        listService.deleteList(listId);
    }

    @PutMapping("/reorder")
    public void reorderLists(@Valid @RequestBody ReorderListsRequest request) {
        listService.reorderLists(request);
    }
}
