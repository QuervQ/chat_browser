# 🚀 Supabaseで動かす（サーバーレス）

あなたのアプリは**既にSupabaseだけで動きます**！
Expressサーバーは静的ファイルの配信だけで、リアルタイム通信は全てブラウザからSupabaseに直接接続しています。

静的ファイルをホスティングすればOKです。

---

## 方法1: Vercel（最も簡単・推奨）

### ステップ1: Vercel CLIインストール

```bash
npm install -g vercel
```

### ステップ2: デプロイ

```bash
# Vercelにログイン
vercel login

# デプロイ
vercel
```

質問には全てEnterで進めばOK！

### ステップ3: 完了

デプロイ完了後、URLが表示されます：
```
https://your-project.vercel.app
```

このURLを共有すれば誰でもアクセス可能！

---

## 方法2: GitHub + Vercel（自動デプロイ）

### ステップ1: GitHubにプッシュ

```bash
# Gitリポジトリ初期化
git init
git add .
git commit -m "Initial commit"

# GitHubにプッシュ
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git branch -M main
git push -u origin main
```

### ステップ2: Vercelでインポート

1. https://vercel.com でサインイン
2. "New Project" をクリック
3. GitHubリポジトリを選択
4. "Deploy" をクリック

**自動設定**:
- Framework: Node.js（自動検出）
- Root Directory: `./`
- Build Command: 自動
- Output Directory: 自動

### ステップ3: 完了

数分でデプロイ完了！URLが表示されます。
以降、GitHubにプッシュするたびに自動デプロイされます。

---

## 方法3: Cloudflare Pages（無料・高速）

### ステップ1: GitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### ステップ2: Cloudflare Pagesで設定

1. https://pages.cloudflare.com でサインイン
2. "Create a project" → "Connect to Git"
3. リポジトリを選択
4. ビルド設定:
   - Build command: `npm install`
   - Build output directory: `public`
5. "Save and Deploy"

---

## 方法4: Netlify（無料）

### ステップ1: GitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### ステップ2: Netlifyでデプロイ

1. https://app.netlify.com でサインイン
2. "Add new site" → "Import an existing project"
3. GitHubを選択
4. リポジトリを選択
5. ビルド設定:
   - Build command: `npm install`
   - Publish directory: `public`
6. "Deploy site"

---

## 📝 デプロイ後の確認

デプロイ後、以下のURLにアクセスできます：

- `https://your-app.vercel.app` - トップページ
- `https://your-app.vercel.app/room/test-room` - ルームページ
- `https://your-app.vercel.app/test.html` - 接続テスト

---

## 🔒 セキュリティ（重要）

現在、Supabase認証情報がHTMLファイルに直接埋め込まれています。
これは開発環境では問題ありませんが、本番環境では環境変数を使うことを推奨します。

### Vercelで環境変数を設定

1. Vercelダッシュボードを開く
2. プロジェクト → Settings → Environment Variables
3. 以下を追加:
   - `SUPABASE_URL`: あなたのSupabase URL
   - `SUPABASE_ANON_KEY`: あなたのSupabase Anon Key

4. `public/room-v2.html` を修正して環境変数を使用:

```javascript
// 環境変数から取得（本番環境）または直接指定（開発環境）
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'https://wzjasatwikzfwfnudxkm.supabase.co';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'your-key';
```

---

## 🎯 おすすめの順序

1. **開発中**: `npm run serve` でローカルテスト
2. **チームで共有**: `npm run share` でngrok公開
3. **本番環境**: Vercelにデプロイ

---

## ⚡ デプロイコマンド早見表

```bash
# Vercel（最速）
npm install -g vercel
vercel login
vercel

# GitHub経由
git init
git add .
git commit -m "Deploy to Supabase-powered app"
git push -u origin main
# → Vercel/Cloudflare/Netlifyでインポート

# 環境変数設定（Vercel）
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

---

## ✅ デプロイ後のチェックリスト

- [ ] URLにアクセスできる
- [ ] ルームページが表示される
- [ ] 複数タブで同時接続できる
- [ ] カーソルが同期される
- [ ] チャットが送受信できる
- [ ] 参加者一覧が更新される

---

## 🆘 トラブルシューティング

### デプロイは成功したがアクセスできない

- ルーティング設定を確認: `vercel.json` が正しいか
- ビルドログを確認: Vercelダッシュボードで確認

### チャットが送信されない

1. ブラウザコンソールでエラー確認
2. Supabase設定を確認:
   - `messages` テーブルが存在するか
   - RLSポリシーが正しいか
   - Realtimeが有効か

### CORS エラー

Supabase側でCORS設定が必要な場合:
1. Supabaseダッシュボード → Settings → API
2. CORS設定でデプロイ先ドメインを追加

---

これで、localhostサーバー不要で**Supabaseだけ**で動きます！
