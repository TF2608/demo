# タスクボード

Trello風のシンプルなタスク管理アプリ。詳細な要件は [REQUIREMENTS.md](REQUIREMENTS.md) を参照。

技術スタック: Java(Spring Boot) + PostgreSQL + React。詳細は [TECH_STACK.md](TECH_STACK.md)。

## 前提条件

- Java 21
- Maven(または `backend/mvnw`)
- Node.js(LTS)
- Docker(PostgreSQL 16コンテナを使用)

## セットアップ

### 1. PostgreSQLの準備

```sh
docker compose up -d
```

`localhost:5432` にPostgreSQL 16のコンテナが起動する(DB名・ユーザー・パスワードはいずれも `taskboard`)。データは名前付きボリューム(`pgdata`)に永続化される。

### 2. バックエンドの起動

```sh
cd backend
./mvnw spring-boot:run
```

初回起動時にFlywayがスキーマとサンプルデータを自動作成する。`http://localhost:8080/api/board` で疎通確認できる。

### 3. フロントエンドの起動

```sh
cd frontend
npm install
npm run dev
```

`http://localhost:5173` を開くとアプリが表示される(`/api/*` へのリクエストはVite devサーバーがバックエンドにプロキシする)。
