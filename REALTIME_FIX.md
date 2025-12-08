# 🔴 Realtime機能が動作しない場合の解決方法

## 問題: メッセージが送信できるが、リアルタイムで同期されない

この問題は、SupabaseでRealtimeが有効化されていないことが原因です。

---

## ✅ 解決手順

### ステップ1: Supabaseダッシュボードにログイン

https://supabase.com/dashboard/project/wzjasatwikzfwfnudxkm

### ステップ2: Replicationページを開く

1. 左サイドバーで **「Database」** をクリック
2. サブメニューから **「Replication」** を選択

### ステップ3: messagesテーブルを有効化

1. ページ内で「**supabase_realtime**」という publication を探す
2. 「**Source**」セクションに「**messages**」テーブルが表示されているか確認

#### ✅ 表示されている場合
→ すでに有効化されています。次のステップへ

#### ❌ 表示されていない場合
→ 以下の方法で有効化してください

---

## 🛠️ Realtimeの有効化方法

### 方法A: UI経由（推奨）

1. **Database** → **Replication** ページで
2. 「**supabase_realtime**」をクリック
3. 「**Insert a table**」ボタンをクリック
4. 「**messages**」を選択
5. 保存

### 方法B: SQL経由

**Database** → **SQL Editor** で以下を実行:

```sql
-- messagesテーブルをRealtimeに追加
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

**注意**: すでに追加されている場合はエラーが出ますが、無視してOKです。

---

## 🧪 動作確認

### 1. Realtimeテストページを開く

**2つのブラウザタブ**で以下を開いてください:

```
https://practice-pcd8639j9-yutois-projects.vercel.app/realtime-test.html
```

### 2. メッセージ送信テスト

#### タブ1で:
1. メッセージを入力
2. 「📤 メッセージ送信」をクリック

#### タブ2で:
→ **数秒以内に自動的にメッセージが表示される**はずです

✅ 成功: リアルタイムで同期される
❌ 失敗: タブ2で何も表示されない → 下記のトラブルシューティングへ

---

## 🐛 トラブルシューティング

### 問題1: チャンネル状態が「SUBSCRIBED」にならない

**原因**: Realtimeが有効化されていない

**解決策**:
1. Supabase Dashboard → Database → Replication
2. messagesテーブルが`supabase_realtime`に追加されているか確認
3. 追加されていない場合は上記の手順で追加

### 問題2: 「permission denied」エラー

**原因**: RLSポリシーが正しく設定されていない

**解決策**: 以下のSQLを実行
```sql
-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Allow public read access" ON messages;
DROP POLICY IF EXISTS "Allow public insert access" ON messages;

-- 新しいポリシーを作成
CREATE POLICY "Allow public read access"
  ON messages FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "Allow public insert access"
  ON messages FOR INSERT TO PUBLIC WITH CHECK (true);

-- RLS有効化
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### 問題3: メッセージが遅延して表示される

**原因**: ネットワーク遅延またはSupabaseの無料プランの制限

**確認方法**:
- ブラウザの開発者ツール（F12）を開く
- Consoleタブで`[SUCCESS]`ログが表示されるか確認
- Networkタブで`realtime`へのWebSocket接続を確認

---

## 📊 Realtime設定の確認SQL

以下のSQLでRealtimeが正しく設定されているか確認できます:

```sql
-- Publicationの確認
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';

-- messagesテーブルが含まれているか確認
SELECT 
  schemaname, 
  tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
  AND tablename = 'messages';
```

結果が返ってくれば、Realtimeは有効化されています。

---

## 🎯 最終チェックリスト

- [ ] messagesテーブルが作成されている
- [ ] RLSポリシーが設定されている
- [ ] messagesテーブルがsupabase_realtimeに追加されている
- [ ] realtime-test.htmlで2つのタブで同期確認済み

すべてチェックできたら、本番のチャットページでもリアルタイムが動作するはずです！

---

## 🆘 それでも解決しない場合

1. **Supabaseのログを確認**
   - Dashboard → Logs → Realtime Logs

2. **ブラウザの開発者ツールで確認**
   - Console: エラーメッセージを確認
   - Network: WebSocket接続を確認

3. **テーブルを再作成**
   - 最終手段として、テーブルを削除して再作成
   - `SUPABASE_SETUP.md`の手順を最初から実行
