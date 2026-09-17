# 技術スタック・非機能要件

親ドキュメント: [REQUIREMENTS.md](REQUIREMENTS.md)

## 技術スタック

### バックエンド
- Java 21
- Spring Boot(Web / Data JPA / Validation)
- Maven
- Flyway(DBマイグレーション)
- PostgreSQL 16

### フロントエンド
- React + TypeScript
- Vite
- TanStack Query(React Query) — サーバー状態管理・データフェッチ
- @dnd-kit — ドラッグ&ドロップ

### データベース
- PostgreSQL(詳細は [DATA_MODEL.md](DATA_MODEL.md))

## 非機能要件

- バックエンド(Spring Boot)とデータベース(PostgreSQL)をローカルで起動して利用する構成(サーバーレス・localStorageのみでの動作ではない)
- ネットワーク越しのアクセスは前提としない(ローカル環境での起動を想定)
- 認証・ユーザー管理は行わない(単一ユーザー・ローカル利用が前提のため)
- 対応環境: フロントエンドはモダンブラウザ、バックエンドはJava 21が動作する環境

## ローカル起動方法

1. PostgreSQLを起動し、`taskboard` データベースを用意する
2. `backend/` で Spring Boot アプリケーションを起動(`http://localhost:8080`)。起動時にFlywayがスキーマを自動作成する
3. `frontend/` で Vite 開発サーバーを起動(`http://localhost:5173`)。`/api/*` へのリクエストはバックエンドにプロキシされる

詳細な手順は [README.md](README.md) を参照。
