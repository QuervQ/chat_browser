# デプロイ手順

## 🚀 方法1: Vercel（最も簡単・推奨）

### 手順
1. GitHubにコードをプッシュ
2. https://vercel.com でサインアップ
3. プロジェクトをインポート
4. 自動でデプロイされます

### コマンド
```bash
# Gitリポジトリ初期化（まだの場合）
git init
git add .
git commit -m "Initial commit"

# GitHubにプッシュ
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main

# または、Vercel CLIを使用
npm install -g vercel
vercel login
vercel
```

デプロイ後のURL: `https://your-project.vercel.app`

---

## 🌐 方法2: Cloudflare Pages

### 手順
1. https://pages.cloudflare.com でサインアップ
2. GitHubリポジトリを接続
3. ビルド設定:
   - Build command: `npm install`
   - Output directory: `public`

---

## 📡 方法3: ngrok（一時的な公開）

ローカル環境をすぐに公開できます（開発・テスト用）

### インストール
```bash
# Homebrewでインストール
brew install ngrok

# または公式サイトからダウンロード
# https://ngrok.com/download
```

### 使い方
```bash
# サーバーを起動（別ターミナル）
node server.js

# ngrokでトンネル作成
ngrok http 3000
```

表示されるURLを共有すればOK！
例: `https://abc123.ngrok.io`

**注意**: ngrokの無料版は一時的なURLです。サーバーを停止するとURLも無効になります。

---

## 🐳 方法4: Railway（無料枠あり）

### 手順
1. https://railway.app でサインアップ
2. New Project → Deploy from GitHub
3. 環境変数を設定
4. 自動でデプロイ

---

## 📦 方法5: Render（無料枠あり）

### 手順
1. https://render.com でサインアップ
2. New Web Service
3. GitHubリポジトリを接続
4. 設定:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`

---

## 🔒 環境変数の設定

デプロイ時は、Supabase認証情報を環境変数で管理してください：

### Vercel
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

または、Vercelダッシュボードで設定

### コード修正（推奨）
`public/room-v2.html` と `src/supabaseRealtime.js` で環境変数を使用：

```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'デフォルト値';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'デフォルト値';
```

---

## 📝 どの方法がおすすめ？

| 方法 | 難易度 | 速度 | 永続性 | 費用 |
|------|--------|------|--------|------|
| **ngrok** | ⭐ | 1分 | 一時的 | 無料 |
| **Vercel** | ⭐⭐ | 5分 | 永続 | 無料 |
| **Cloudflare** | ⭐⭐ | 10分 | 永続 | 無料 |
| **Railway** | ⭐⭐ | 10分 | 永続 | 無料枠 |
| **Render** | ⭐⭐ | 10分 | 永続 | 無料枠 |

### 推奨順
1. **今すぐテストしたい** → ngrok
2. **チームで開発中** → Vercel
3. **本番環境** → Vercel または Cloudflare

---

## 🚀 今すぐ試す（ngrok）

```bash
# ターミナル1: サーバー起動
node server.js

# ターミナル2: ngrokでトンネル作成
ngrok http 3000
```

表示されるURLを共有すれば、誰でもアクセスできます！
