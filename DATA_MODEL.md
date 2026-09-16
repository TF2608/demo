# データ設計

親ドキュメント: [REQUIREMENTS.md](REQUIREMENTS.md)

## 前提

本アプリはPostgreSQLにデータを永続化する。リスト・カードはそれぞれテーブルとして保持し、`lists` と `cards` は1対多の関係(1つのリストが複数のカードを持つ)。

配列順(JS配列のindex)で表現していた表示順は、各テーブルに明示的な `position`(整数)カラムを持たせて管理する。並び替え・移動時は、対象リスト内のカード(またはボード全体のリスト)の `position` をサーバー側で0始まりの連番に振り直す。

## テーブル定義

### lists(リスト)

| カラム | 型 | 説明 |
|---|---|---|
| id | BIGINT (identity) | 主キー |
| title | VARCHAR(255) NOT NULL | リスト名 |
| position | INTEGER NOT NULL | 表示順(0始まり) |
| created_at | TIMESTAMPTZ NOT NULL | 作成日時 |
| updated_at | TIMESTAMPTZ NOT NULL | 更新日時 |

### cards(カード)

| カラム | 型 | 説明 |
|---|---|---|
| id | BIGINT (identity) | 主キー |
| list_id | BIGINT NOT NULL, FK → lists.id (ON DELETE CASCADE) | 所属リスト。リスト削除時にカードも削除される |
| text | TEXT NOT NULL | カードの本文(タイトル) |
| done | BOOLEAN NOT NULL DEFAULT false | 完了フラグ |
| priority | VARCHAR(10) NOT NULL DEFAULT 'mid', CHECK (priority IN ('high','mid','low')) | 優先度。未設定の場合は "mid" 扱い |
| position | INTEGER NOT NULL | リスト内での表示順(0始まり) |
| created_at | TIMESTAMPTZ NOT NULL | 作成日時 |
| updated_at | TIMESTAMPTZ NOT NULL | 更新日時 |

インデックス: `lists(position)`、`cards(list_id, position)`(リスト内のカードを順序付きで取得するため)。

## マイグレーション

スキーマはFlyway(`backend/src/main/resources/db/migration/`)で管理する。`V1__init_schema.sql` がテーブル・制約・インデックスを作成し、`V2__seed_default_board.sql` が初期表示用のサンプルデータ(未着手/進行中/完了の3リストとサンプルカード)を投入する。

## 補足

- 並び替え・移動のAPIはクライアントに `position` を直接指定させず、「新しい並び順(IDの配列)」または「移動先リストと挿入位置」を渡し、サーバー側で対象リストの `position` を一括で振り直す(詳細は [FEATURES.md](FEATURES.md) のAPI設計に相当するバックエンド実装を参照)
- IDはDBの自動採番(identity)を使用し、リストとカードは別テーブル・別シーケンスのため、両者のIDが同じ数値になることがある(それぞれ独立したIDとして扱う)
