CREATE TABLE lists (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    position    INTEGER NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cards (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    list_id     BIGINT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    text        TEXT NOT NULL,
    done        BOOLEAN NOT NULL DEFAULT false,
    priority    VARCHAR(10) NOT NULL DEFAULT 'mid' CHECK (priority IN ('high', 'mid', 'low')),
    position    INTEGER NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lists_position ON lists(position);
CREATE INDEX idx_cards_list_id_position ON cards(list_id, position);
