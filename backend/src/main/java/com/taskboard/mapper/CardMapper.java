package com.taskboard.mapper;

import com.taskboard.dto.CardDto;
import com.taskboard.entity.Card;
import org.springframework.stereotype.Component;

@Component
public class CardMapper {

    public CardDto toDto(Card card) {
        return new CardDto(
                card.getId(),
                card.getListId(),
                card.getText(),
                card.isDone(),
                card.getPriority().getValue(),
                card.getPosition()
        );
    }
}
