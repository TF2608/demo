package com.taskboard.service;

import com.taskboard.dto.CardDto;
import com.taskboard.entity.Card;
import com.taskboard.entity.Priority;
import com.taskboard.exception.NotFoundException;
import com.taskboard.mapper.CardMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.CardSpecifications;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CardService {

    private final CardRepository cardRepository;
    private final CardMapper cardMapper;

    public CardService(CardRepository cardRepository, CardMapper cardMapper) {
        this.cardRepository = cardRepository;
        this.cardMapper = cardMapper;
    }

    public List<CardDto> searchCards(Long listId, Priority priority, Boolean done, String text) {
        Specification<Card> spec = Specification
                .where(CardSpecifications.listIdEquals(listId))
                .and(CardSpecifications.priorityEquals(priority))
                .and(CardSpecifications.doneEquals(done))
                .and(CardSpecifications.textContains(text));

        return cardRepository.findAll(spec).stream()
                .map(cardMapper::toDto)
                .toList();
    }

    public CardDto getCard(Long id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Card not found: " + id));
        return cardMapper.toDto(card);
    }
}
