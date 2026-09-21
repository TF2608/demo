INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, 'ワイヤーフレームを作成する', false, 'high', 1 FROM lists WHERE title = '未着手';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, '競合調査を行う', false, 'low', 2 FROM lists WHERE title = '未着手';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, 'APIの設計を行う', false, 'high', 0 FROM lists WHERE title = '進行中';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, 'DBスキーマを検討する', false, 'mid', 1 FROM lists WHERE title = '進行中';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, 'レビュー観点を整理する', false, 'low', 2 FROM lists WHERE title = '進行中';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, 'プロジェクトのキックオフを行う', true, 'high', 1 FROM lists WHERE title = '完了';

INSERT INTO cards (list_id, text, done, priority, position)
SELECT id, '開発環境をセットアップする', true, 'low', 2 FROM lists WHERE title = '完了';
