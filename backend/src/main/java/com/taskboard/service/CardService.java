package com.taskboard.service;

import com.taskboard.dto.CardDto;
import com.taskboard.dto.CreateCardRequest;
import com.taskboard.dto.MoveCardRequest;
import com.taskboard.dto.UpdateCardRequest;
import com.taskboard.entity.Card;
import com.taskboard.entity.Priority;
import com.taskboard.entity.TaskList;
import com.taskboard.exception.NotFoundException;
import com.taskboard.mapper.CardMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.TaskListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final TaskListRepository taskListRepository;
    private final CardMapper cardMapper;

    @Transactional
    public CardDto createCard(Long listId, CreateCardRequest request) {
        findListOrThrow(listId);
        int nextPosition = cardRepository.findByListIdOrderByPosition(listId).size();
        Card card = new Card(listId, request.text(), nextPosition);
        cardRepository.save(card);
        return cardMapper.toDto(card);
    }

    @Transactional
    public CardDto updateCard(Long cardId, UpdateCardRequest request) {
        Card card = findCardOrThrow(cardId);
        if (request.text() != null) {
            card.setText(request.text());
        }
        if (request.done() != null) {
            card.setDone(request.done());
        }
        if (request.priority() != null) {
            card.setPriority(Priority.fromValue(request.priority()));
        }
        cardRepository.save(card);
        return cardMapper.toDto(card);
    }

    @Transactional
    public void deleteCard(Long cardId) {
        Card card = findCardOrThrow(cardId);
        cardRepository.delete(card);
        renumber(cardRepository.findByListIdOrderByPosition(card.getListId()));
    }

    @Transactional
    public CardDto moveCard(Long cardId, MoveCardRequest request) {
        Card card = findCardOrThrow(cardId);
        findListOrThrow(request.targetListId());

        Long sourceListId = card.getListId();
        boolean sameList = sourceListId.equals(request.targetListId());

        List<Card> targetCards = new ArrayList<>(cardRepository.findByListIdOrderByPosition(request.targetListId()));
        if (sameList) {
            targetCards.removeIf(c -> c.getId().equals(cardId));
        }

        int insertIndex = Math.max(0, Math.min(request.targetPosition(), targetCards.size()));
        targetCards.add(insertIndex, card);

        card.setListId(request.targetListId());
        renumber(targetCards);

        if (!sameList) {
            renumber(cardRepository.findByListIdOrderByPosition(sourceListId));
        }

        return cardMapper.toDto(card);
    }

    private void renumber(List<Card> cards) {
        for (int index = 0; index < cards.size(); index++) {
            cards.get(index).setPosition(index);
        }
        cardRepository.saveAll(cards);
    }

    private Card findCardOrThrow(Long cardId) {
        return cardRepository.findById(cardId)
                .orElseThrow(() -> new NotFoundException("Card not found: " + cardId));
    }

    private TaskList findListOrThrow(Long listId) {
        return taskListRepository.findById(listId)
                .orElseThrow(() -> new NotFoundException("List not found: " + listId));
    }
}
