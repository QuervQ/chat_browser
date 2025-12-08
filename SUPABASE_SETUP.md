# Supabase データベース設定

チャット機能が動作しないのは、Supabaseに`messages`テーブルが作成されていないためです。

## 🛠️ テーブル作成手順

### 1. Supabaseダッシュボードにアクセス
https://supabase.com/dashboard/project/wzjasatwikzfwfnudxkm

### 2. SQL Editorを開く
左サイドバーから「SQL Editor」をクリック

### 3. 以下のSQLを実行

```sql
-- messagesテーブルの作成
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Row Level Security (RLS) を有効化
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 誰でも読み取り可能（SELECT）
CREATE POLICY "Allow public read access"
  ON messages
  FOR SELECT
  TO PUBLIC
  USING (true);

-- 誰でも書き込み可能（INSERT）
CREATE POLICY "Allow public insert access"
  ON messages
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- Realtimeを有効化（既に追加済みの場合はエラーが出ますが問題ありません）
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

### 4. 確認

実行後、「Table Editor」で`messages`テーブルが表示されることを確認してください。

**⚠️ 注意**: `"messages" is already member of publication "supabase_realtime"` というエラーが出る場合は、すでに正しく設定されているので無視してOKです。

## 📊 テーブル構造

| カラム名 | データ型 | 説明 |
|---------|---------|------|
| id | BIGSERIAL | 自動採番のプライマリキー |
| room_id | TEXT | ルームID |
| user_id | TEXT | ユーザーID（UUID） |
| name | TEXT | ユーザー名 |
| content | TEXT | メッセージ内容 |
| created_at | TIMESTAMP | 作成日時（自動） |

## 🔒 セキュリティ設定

現在の設定は**デモ用**です。本番環境では以下のような制限を追加してください：

```sql
-- 例: 認証済みユーザーのみ書き込み可能
CREATE POLICY "Authenticated users can insert"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);
```

## ✅ 動作確認

1. SQLを実行
2. アプリをリロード: https://practice-8wnkcwp39-yutois-projects.vercel.app/room/test-room
3. メッセージを送信
4. 別のタブで同じルームを開いて確認

## 🐛 トラブルシューティング

### エラー: "permission denied for table messages"
→ RLSポリシーを確認してください

### エラー: "relation 'messages' does not exist"
→ テーブルが作成されていません。上記SQLを実行してください

### メッセージが表示されない
→ ブラウザの開発者ツール（F12）でコンソールエラーを確認してください
