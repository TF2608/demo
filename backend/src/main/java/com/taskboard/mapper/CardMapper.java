package com.taskboard.mapper;

import com.taskboard.dto.CardDto;
import com.taskboard.entity.Card;
import org.springframework.stereotype.Component;

@Component
public class CardMapper {

    public CardDto toDto(Card card) {
        return new CardDto(
                card.getId(),
                card.getList().getId(),
                card.getText(),
                card.getDone(),
                card.getPriority().getValue(),
                card.getPosition(),
                card.getCreatedAt(),
                card.getUpdatedAt()
        );
    }
}
