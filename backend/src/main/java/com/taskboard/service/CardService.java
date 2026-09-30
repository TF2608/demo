package com.taskboard.service;

import com.taskboard.dto.CardDto;
import com.taskboard.dto.CardMoveRequest;
import com.taskboard.dto.CardUpdateRequest;
import com.taskboard.entity.Card;
import com.taskboard.entity.Priority;
import com.taskboard.entity.TaskList;
import com.taskboard.exception.NotFoundException;
import com.taskboard.mapper.CardMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.CardSpecifications;
import com.taskboard.repository.TaskListRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;
    private final CardMapper cardMapper;
    private final TaskListRepository taskListRepository;

    public CardService(CardRepository cardRepository, CardMapper cardMapper, TaskListRepository taskListRepository) {
        this.cardRepository = cardRepository;
        this.cardMapper = cardMapper;
        this.taskListRepository = taskListRepository;
    }

    public List<CardDto> searchCards(Long listId, Priority priority, Boolean done, String text) {
        Specification<Card> spec = Specification
                .where(CardSpecifications.listIdEquals(listId))
                .and(CardSpecifications.priorityEquals(priority))
                .and(CardSpecifications.doneEquals(done))
                .and(CardSpecifications.textContains(text));

        return cardRepository.findAll(spec, Sort.by("position", "id")).stream()
                .map(cardMapper::toDto)
                .toList();
    }

    public CardDto getCard(Long id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found: " + id));
        return cardMapper.toDto(card);
    }

    @Transactional
    public CardDto updateCard(Long id, CardUpdateRequest request) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found: " + id));

        if (request.text() != null && request.text().isBlank()) {
            throw new IllegalArgumentException("text must not be blank");
        }

        Priority priority = request.priority() == null ? null : Priority.fromValue(request.priority());

        TaskList list = null;
        if (request.listId() != null) {
            list = taskListRepository.findById(request.listId())
                    .orElseThrow(() -> new NotFoundException("List not found: " + request.listId()));
        }

        cardMapper.applyUpdate(card, request, list, priority);
        card.setUpdatedAt(OffsetDateTime.now());

        return cardMapper.toDto(cardRepository.save(card));
    }

    @Transactional
    public CardDto moveCard(Long id, CardMoveRequest request) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found: " + id));
        TaskList targetList = taskListRepository.findById(request.listId())
                .orElseThrow(() -> new NotFoundException("List not found: " + request.listId()));

        Long sourceListId = card.getList().getId();
        OffsetDateTime now = OffsetDateTime.now();

        if (!sourceListId.equals(targetList.getId())) {
            List<Card> sourceCards = new ArrayList<>(cardRepository.findByListIdOrderByPositionAsc(sourceListId));
            sourceCards.removeIf(c -> c.getId().equals(id));
            renumber(sourceCards, now);
            card.setList(targetList);
        }

        List<Card> targetCards = new ArrayList<>(cardRepository.findByListIdOrderByPositionAsc(targetList.getId()));
        targetCards.removeIf(c -> c.getId().equals(id));
        int index = Math.max(0, Math.min(request.position(), targetCards.size()));
        targetCards.add(index, card);
        renumber(targetCards, now);

        cardRepository.saveAll(targetCards);
        return cardMapper.toDto(card);
    }

    private void renumber(List<Card> cards, OffsetDateTime now) {
        for (int i = 0; i < cards.size(); i++) {
            Card c = cards.get(i);
            if (!Integer.valueOf(i).equals(c.getPosition())) {
                c.setPosition(i);
                c.setUpdatedAt(now);
            }
        }
    }
}
