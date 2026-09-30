-- seed（V2/V3）で重複・欠番のある cards.position を、リストごとに 0..n-1 へ振り直す
UPDATE cards c
SET position = r.new_position
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY list_id ORDER BY position, id) - 1 AS new_position
    FROM cards
) r
WHERE c.id = r.id;
