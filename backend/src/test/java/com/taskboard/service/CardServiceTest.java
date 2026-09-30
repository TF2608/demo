package com.taskboard.service;

import com.taskboard.dto.CardMoveRequest;
import com.taskboard.entity.Card;
import com.taskboard.entity.Priority;
import com.taskboard.entity.TaskList;
import com.taskboard.exception.NotFoundException;
import com.taskboard.mapper.CardMapper;
import com.taskboard.repository.CardRepository;
import com.taskboard.repository.TaskListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CardServiceTest {

    private CardRepository cardRepository;
    private TaskListRepository taskListRepository;
    private CardService cardService;

    private TaskList list1;
    private TaskList list2;
    private TaskList emptyList;
    private final List<Card> allCards = new ArrayList<>();

    @BeforeEach
    void setUp() {
        cardRepository = mock(CardRepository.class);
        taskListRepository = mock(TaskListRepository.class);
        cardService = new CardService(cardRepository, new CardMapper(), taskListRepository);

        list1 = list(1L);
        list2 = list(2L);
        emptyList = list(3L);
        // list1: A(1) B(2) C(3) / list2: X(4) Y(5)
        card(1L, list1, 0);
        card(2L, list1, 1);
        card(3L, list1, 2);
        card(4L, list2, 0);
        card(5L, list2, 1);

        when(taskListRepository.findById(1L)).thenReturn(Optional.of(list1));
        when(taskListRepository.findById(2L)).thenReturn(Optional.of(list2));
        when(taskListRepository.findById(3L)).thenReturn(Optional.of(emptyList));
        when(taskListRepository.findById(99L)).thenReturn(Optional.empty());
        when(cardRepository.findById(anyLong())).thenAnswer(inv -> allCards.stream()
                .filter(c -> c.getId().equals(inv.getArgument(0))).findFirst());
        when(cardRepository.findByListIdOrderByPositionAsc(anyLong())).thenAnswer(inv -> allCards.stream()
                .filter(c -> c.getList().getId().equals(inv.getArgument(0)))
                .sorted(Comparator.comparing(Card::getPosition))
                .toList());
        when(cardRepository.saveAll(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void 同一リストで先頭から末尾へ移動できる() {
        cardService.moveCard(1L, new CardMoveRequest(1L, 2));
        assertEquals("2,3,1", order(1L));
    }

    @Test
    void 同一リストで末尾から先頭へ移動できる() {
        cardService.moveCard(3L, new CardMoveRequest(1L, 0));
        assertEquals("3,1,2", order(1L));
    }

    @Test
    void 同一位置への移動は順序が変わらない() {
        cardService.moveCard(2L, new CardMoveRequest(1L, 1));
        assertEquals("1,2,3", order(1L));
    }

    @Test
    void 範囲外のpositionは末尾と先頭にclampされる() {
        cardService.moveCard(1L, new CardMoveRequest(1L, 100));
        assertEquals("2,3,1", order(1L));
        cardService.moveCard(1L, new CardMoveRequest(1L, -5));
        assertEquals("1,2,3", order(1L));
    }

    @Test
    void 別リストの中間に挿入でき移動元が詰め直される() {
        cardService.moveCard(2L, new CardMoveRequest(2L, 1));
        assertEquals("4,2,5", order(2L));
        assertEquals("1,3", order(1L));
        assertEquals(1, find(3L).getPosition());
    }

    @Test
    void 別リストの先頭と末尾に挿入できる() {
        cardService.moveCard(1L, new CardMoveRequest(2L, 0));
        assertEquals("1,4,5", order(2L));
        cardService.moveCard(3L, new CardMoveRequest(2L, 3));
        assertEquals("1,4,5,3", order(2L));
        assertEquals("2", order(1L));
    }

    @Test
    void 空リストへ移動できる() {
        cardService.moveCard(1L, new CardMoveRequest(3L, 0));
        assertEquals("1", order(3L));
        assertEquals("2,3", order(1L));
        assertEquals(0, find(2L).getPosition());
    }

    @Test
    void 存在しないカードは404() {
        assertThrows(NotFoundException.class, () -> cardService.moveCard(99L, new CardMoveRequest(1L, 0)));
    }

    @Test
    void 存在しないリストは404() {
        assertThrows(NotFoundException.class, () -> cardService.moveCard(1L, new CardMoveRequest(99L, 0)));
    }

    private String order(Long listId) {
        return allCards.stream()
                .filter(c -> c.getList().getId().equals(listId))
                .sorted(Comparator.comparing(Card::getPosition))
                .map(c -> String.valueOf(c.getId()))
                .collect(Collectors.joining(","));
    }

    private Card find(Long id) {
        return allCards.stream().filter(c -> c.getId().equals(id)).findFirst().orElseThrow();
    }

    private TaskList list(Long id) {
        TaskList l = new TaskList();
        l.setId(id);
        return l;
    }

    private void card(Long id, TaskList list, int position) {
        Card c = new Card();
        c.setId(id);
        c.setList(list);
        c.setText("card" + id);
        c.setDone(false);
        c.setPriority(Priority.values()[0]);
        c.setPosition(position);
        c.setCreatedAt(OffsetDateTime.now());
        c.setUpdatedAt(OffsetDateTime.now());
        allCards.add(c);
    }
}
