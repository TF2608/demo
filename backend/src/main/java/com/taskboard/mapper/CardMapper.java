package com.taskboard.mapper;

import com.taskboard.dto.CardDto;
import com.taskboard.dto.CardUpdateRequest;
import com.taskboard.entity.Card;
import com.taskboard.entity.Priority;
import com.taskboard.entity.TaskList;
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

    public void applyUpdate(Card card, CardUpdateRequest request, TaskList newList, Priority newPriority) {
        if (request.text() != null) {
            card.setText(request.text());
        }
        if (newPriority != null) {
            card.setPriority(newPriority);
        }
        if (request.done() != null) {
            card.setDone(request.done());
        }
        if (newList != null) {
            card.setList(newList);
        }
        if (request.position() != null) {
            card.setPosition(request.position());
        }
    }
}
