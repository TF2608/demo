INSERT INTO lists (title, position) VALUES
    ('未着手', 0),
    ('進行中', 1),
    ('完了', 2);

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, '資料を作成する', false, 'mid', 0 FROM lists WHERE title = '未着手';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, '要件定義をまとめる', true, 'mid', 0 FROM lists WHERE title = '完了';
