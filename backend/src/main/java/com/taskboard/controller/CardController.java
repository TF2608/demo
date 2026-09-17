package com.taskboard.controller;

import com.taskboard.dto.CardDto;
import com.taskboard.dto.CreateCardRequest;
import com.taskboard.dto.MoveCardRequest;
import com.taskboard.dto.UpdateCardRequest;
import com.taskboard.service.CardService;
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
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/api/lists/{listId}/cards")
    @ResponseStatus(HttpStatus.CREATED)
    public CardDto createCard(@PathVariable Long listId, @Valid @RequestBody CreateCardRequest request) {
        return cardService.createCard(listId, request);
    }

    @PatchMapping("/api/cards/{cardId}")
    public CardDto updateCard(@PathVariable Long cardId, @Valid @RequestBody UpdateCardRequest request) {
        return cardService.updateCard(cardId, request);
    }

    @DeleteMapping("/api/cards/{cardId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(@PathVariable Long cardId) {
        cardService.deleteCard(cardId);
    }

    @PutMapping("/api/cards/{cardId}/move")
    public CardDto moveCard(@PathVariable Long cardId, @Valid @RequestBody MoveCardRequest request) {
        return cardService.moveCard(cardId, request);
    }
}
