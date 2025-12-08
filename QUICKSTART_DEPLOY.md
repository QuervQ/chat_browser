# 🚀 リアルタイム通信アプリ - クイックスタート

Supabaseを使った**カーソル共有** + **リアルタイムチャット**アプリです。

---

## 🎯 デモURL

### 本番環境
**https://practice-3q9mwjbbc-yutois-projects.vercel.app**

1. **トップページ**: ルームを選択・作成
2. **カーソル + チャット**: リアルタイムで同期
3. **複数人で同時接続可能**: URLを共有するだけ

---

## ✨ 機能

- 🖱️ **リアルタイムカーソル共有** - マウスの動きが他のユーザーに表示される
- 💬 **リアルタイムチャット** - メッセージが瞬時に同期
- 👥 **参加者一覧** - 誰がオンラインか確認できる
- 🔗 **簡単共有** - ルームURLをコピーして友達に送るだけ

---

## 🚀 5秒で始める

### 1. トップページにアクセス
https://practice-3q9mwjbbc-yutois-projects.vercel.app

### 2. ルーム名を入力（または「ランダムルーム作成」をクリック）

### 3. URLを友達に共有
画面右上の「🔗 ルームURLをコピー」ボタンをクリック

### 4. リアルタイムで楽しむ！
- マウスを動かすと相手側にカーソルが表示されます
- チャットで会話できます

---

## 🛠️ セットアップ（開発者向け）

### 前提条件
このプロジェクトはSupabaseのリアルタイム機能を使用しています。

### Supabaseの設定

#### 1. messagesテーブルの作成
Supabase Dashboard → SQL Editor で以下を実行:

```sql
-- テーブル作成
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- RLS有効化
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- パブリックアクセスポリシー
CREATE POLICY "Allow public read" ON messages FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "Allow public insert" ON messages FOR INSERT TO PUBLIC WITH CHECK (true);

-- Realtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

#### 2. Realtime設定の確認
Supabase Dashboard → Database → Replication

- `supabase_realtime`に`messages`テーブルが追加されているか確認

---

## 🧪 テストツール

開発時に使える便利なツールを用意しています：

### デバッグツール
**https://practice-3q9mwjbbc-yutois-projects.vercel.app/debug-messages.html**

- テーブルの存在確認
- メッセージ送信テスト
- エラー診断

### Realtimeテスト
**https://practice-3q9mwjbbc-yutois-projects.vercel.app/realtime-test.html**

- リアルタイム同期の確認
- 接続状態の監視
- 詳細ログ表示

---

## 📁 プロジェクト構造

```
practice/
├── public/
│   ├── index.html              # トップページ（ルーム選択）
│   ├── room-v2.html            # メインルームページ
│   ├── realtime-test.html      # Realtimeテスト
│   └── debug-messages.html     # デバッグツール
├── src/
│   └── supabaseRealtime.js     # コアモジュール
├── examples/
│   ├── useSupabaseRealtime.jsx # React統合例
│   ├── electron-main.js        # Electron統合例
│   └── ...
└── docs/
    ├── SUPABASE_SETUP.md       # Supabase設定手順
    ├── REALTIME_FIX.md         # Realtimeトラブルシュート
    └── README_REALTIME.md      # API詳細ドキュメント
```

---

## 🔧 ローカル開発

### 1. リポジトリをクローン
```bash
git clone <your-repo-url>
cd practice
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 開発サーバー起動
```bash
npm run serve
# または
node server.js
```

### 4. ブラウザで開く
http://localhost:3000

---

## 🌐 デプロイ

### Vercelへのデプロイ

```bash
# Vercel CLIでログイン
vercel login

# 本番環境にデプロイ
vercel --prod
```

### 環境変数（オプション）

セキュリティ強化のため、Supabase認証情報を環境変数化できます：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎨 カスタマイズ

### UIの変更
`public/room-v2.html`のCSSを編集してください。

### 機能の追加
`src/supabaseRealtime.js`を拡張して、以下のような機能を追加できます：

- ビデオ通話（WebRTC統合）
- ファイル共有
- 描画機能
- リアクション機能

詳細は`examples/`フォルダのサンプルコードを参照してください。

---

## 📚 ドキュメント

- **[Supabase設定ガイド](SUPABASE_SETUP.md)** - テーブル作成手順
- **[Realtimeトラブルシュート](REALTIME_FIX.md)** - 問題解決方法
- **[APIリファレンス](README_REALTIME.md)** - 詳細なAPI仕様
- **[デプロイガイド](DEPLOY.md)** - 各種プラットフォームへのデプロイ方法

---

## 🤝 チーム統合

このプロジェクトは他のチームメンバーのコードと統合できるように設計されています：

- **WebRTC担当**: `examples/`のWebRTC統合例を参照
- **Electron担当**: `examples/electron-*.js`を参照
- **React UI担当**: `examples/useSupabaseRealtime.jsx`を参照

---

## 🐛 トラブルシューティング

### メッセージが送信できない
→ `SUPABASE_SETUP.md`を確認してテーブルを作成してください

### リアルタイムで同期されない
→ `REALTIME_FIX.md`を確認してRealtime設定を有効化してください

### デバッグ方法
1. ブラウザの開発者ツール（F12）を開く
2. Consoleタブでエラーを確認
3. `/debug-messages.html`でテストを実行

---

## 📄 ライセンス

MIT

---

## 👤 作成者

**practice** - リアルタイム通信学習プロジェクト

---

## 🙏 謝辞

- [Supabase](https://supabase.com/) - バックエンド・リアルタイム機能
- [Vercel](https://vercel.com/) - ホスティング
- [Next.js](https://nextjs.org/) - フレームワーク
