package com.taskboard.repository;

import com.taskboard.entity.Card;
import com.taskboard.entity.Priority;
import org.springframework.data.jpa.domain.Specification;

public final class CardSpecifications {

    private CardSpecifications() {
    }

    public static Specification<Card> listIdEquals(Long listId) {
        return (root, query, cb) -> listId == null ? null : cb.equal(root.get("list").get("id"), listId);
    }

    public static Specification<Card> priorityEquals(Priority priority) {
        return (root, query, cb) -> priority == null ? null : cb.equal(root.get("priority"), priority);
    }

    public static Specification<Card> doneEquals(Boolean done) {
        return (root, query, cb) -> done == null ? null : cb.equal(root.get("done"), done);
    }

    public static Specification<Card> textContains(String text) {
        return (root, query, cb) -> {
            if (text == null || text.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("text")), "%" + text.toLowerCase() + "%");
        };
    }
}
