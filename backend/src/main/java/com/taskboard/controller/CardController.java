package com.taskboard.controller;

import com.taskboard.dto.CardDto;
import com.taskboard.entity.Priority;
import com.taskboard.service.CardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping
    public List<CardDto> searchCards(
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Boolean done,
            @RequestParam(required = false) String text
    ) {
        Priority priorityValue = priority == null ? null : Priority.fromValue(priority);
        return cardService.searchCards(listId, priorityValue, done, text);
    }

    @GetMapping("/{id}")
    public CardDto getCard(@PathVariable Long id) {
        return cardService.getCard(id);
    }
}
