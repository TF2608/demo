# データ設計

親ドキュメント: [REQUIREMENTS.md](REQUIREMENTS.md)

## 前提
本アプリはサーバー・DBを持たず、ブラウザの `localStorage` にデータを保存する。そのため一般的な「ER図」ではなく、保存されるJSONのデータ構造として定義する。

将来的にサーバー・DBを導入する場合は、下記構造をそのままテーブル定義(List / Card の2テーブル、CardがListに外部キーで紐づく1対多)に変換できる想定。

## 保存先
- キー: `trello-lite-board`(localStorageのキー名)
- 値: `List[]` のJSON文字列

## データ構造

### List(リスト)
| フィールド | 型 | 説明 |
|---|---|---|
| id | string | 一意なID |
| title | string | リスト名 |
| cards | Card[] | このリストに属するカードの配列(表示順=配列順) |

### Card(カード)
| フィールド | 型 | 説明 |
|---|---|---|
| id | string | 一意なID |
| text | string | カードの本文(タイトル) |
| done | boolean | 完了フラグ |

## サンプルデータ
```json
[
  {
    "id": "a1b2c3",
    "title": "未着手",
    "cards": [
      { "id": "x1y2z3", "text": "資料を作成する", "done": false }
    ]
  },
  {
    "id": "d4e5f6",
    "title": "進行中",
    "cards": []
  },
  {
    "id": "g7h8i9",
    "title": "完了",
    "cards": [
      { "id": "p1q2r3", "text": "要件定義をまとめる", "done": true }
    ]
  }
]
```

## 補足
- リスト・カードの表示順は配列の並び順で管理する(順序を表す番号フィールドは持たない)
- IDは `id: string` としてクライアント側でランダム生成(サーバーの採番なし)
