-- 既存のテーブルを削除して再作成（データも削除されます！）
DROP TABLE IF EXISTS public.messages CASCADE;

-- メッセージテーブルの作成
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- インデックスの作成
CREATE INDEX messages_room_id_idx ON public.messages(room_id);
CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);

-- RLS の有効化
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Enable read access for all users" ON public.messages
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.messages
    FOR INSERT WITH CHECK (true);

-- リアルタイム機能を有効化
DO $$
BEGIN
    -- テーブルがパブリケーションに既に存在するか確認
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
        AND tablename = 'messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- エラーが発生してもスキップ
        RAISE NOTICE 'Publication already contains messages table or error occurred: %', SQLERRM;
END $$;

-- スキーマキャッシュをリロード
NOTIFY pgrst, 'reload schema';

-- 確認
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;
