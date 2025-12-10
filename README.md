# リアルタイム カーソル & チャット

Supabaseを使用したリアルタイムカーソル共有とチャット機能を持つWebアプリケーション。

## 機能

- ✨ リアルタイムでカーソル位置を共有
- 💬 チャットで会話ができる
- 👥 複数人で同時に参加可能
- 🌈 各ユーザーに異なる色を自動割り当て
- 💾 メッセージはSupabaseに永続化

## セットアップ

### 1. 環境変数の設定

#### ローカル開発

`.env.local` ファイルを作成（既に存在する場合はそのまま）：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Vercelデプロイ

Vercelダッシュボードで環境変数を設定：

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 以下の変数を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Environment: `Production`, `Preview`, `Development` 全てにチェック

### 2. Supabaseのセットアップ

Supabase SQL Editorで `supabase-reset.sql` を実行してテーブルを作成：

```sql
-- supabase-reset.sql の内容を実行
```

## 開発

### ローカルサーバー起動

```bash
npx vercel dev
```

http://localhost:3000 でアクセス可能

### デプロイ

```bash
npm run deploy
```

または

```bash
npx vercel --prod
```

## プロジェクト構造

```
/api
  ├── index.js          # トップページハンドラー
  └── room.js           # ルームページハンドラー（環境変数を注入）
/public
  ├── index.html        # トップページ
  └── room-v3.html      # チャットルームページ
/supabase-reset.sql     # データベースセットアップSQL
/.env.local             # ローカル環境変数（Gitに含まれない）
```

## セキュリティ

- 認証情報はコードに直接書かず、環境変数を使用
- `.env.local` は `.gitignore` に含まれている
- Supabase Anon Keyは公開しても安全（Row Level Securityで保護）

## トラブルシューティング

### `URL: :q` エラーが出る

環境変数が正しく設定されていません：

1. Vercelダッシュボードで環境変数を確認
2. 設定後、再デプロイが必要
3. ローカルの場合は `.env.local` を確認

### メッセージが送信できない

1. Supabaseで `messages` テーブルが作成されているか確認
2. RLSポリシーが正しく設定されているか確認
3. リアルタイム機能が有効か確認（Database → Replication）

## ライセンス

ISC
