# 技術スタック・非機能要件

親ドキュメント: [REQUIREMENTS.md](REQUIREMENTS.md)

## 技術スタック
- HTML / CSS / JavaScript(プレーン、ビルド不要、フレームワーク不使用)
- データ永続化: ブラウザの `localStorage`(詳細は [DATA_MODEL.md](DATA_MODEL.md))

## 非機能要件
- サーバー・バックエンドは持たない(フロントエンドのみで完結)
- インターネット接続不要(ローカルのHTMLファイルを開くだけで動作)
- 対応環境: モダンブラウザ(localStorageとHTML5 Drag and Drop APIが使えること)

## 動作環境・設置場所
- デスクトップの単体HTMLファイルをブラウザで開いて使用
  - 設置場所: `~/Desktop/タスクボード/index.html`
