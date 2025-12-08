-- ✅ RLSポリシーの確認と修正
-- テーブルがすでに存在する場合に実行してください

-- 既存のポリシーを削除（エラーが出ても問題ありません）
DROP POLICY IF EXISTS "Allow public read access" ON messages;
DROP POLICY IF EXISTS "Allow public insert access" ON messages;

-- 新しいポリシーを作成
CREATE POLICY "Allow public read access"
  ON messages
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public insert access"
  ON messages
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

-- RLSが有効になっているか確認
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ✅ 完了！
-- 以下のクエリで確認できます：
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'messages';
