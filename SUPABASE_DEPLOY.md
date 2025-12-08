# 🎉 Supabaseで動かす準備完了！

## ✅ 設定完了

あなたのアプリは**既にSupabaseだけで動きます**！

### なぜサーバー不要？

- ✅ Expressサーバーは静的ファイル配信のみ
- ✅ リアルタイム通信は全てブラウザ→Supabase直接接続
- ✅ カーソル、チャット、参加者管理すべてSupabaseで処理

つまり、静的ファイルをホスティングすれば**localhostサーバー不要**で動きます！

---

## 🚀 デプロイ方法（3つから選択）

### 方法1: 自動スクリプト（最も簡単）

```bash
npm run deploy-wizard
```

または

```bash
./deploy-vercel.sh
```

このスクリプトが以下を自動実行:
1. Vercel CLIインストール確認
2. Gitリポジトリ初期化（必要な場合）
3. Vercelログイン
4. デプロイ実行

### 方法2: 手動コマンド

```bash
# Vercelにログイン
vercel login

# デプロイ
npm run deploy
```

または

```bash
vercel --prod
```

### 方法3: GitHub連携（自動デプロイ）

#### ステップ1: GitHubにプッシュ

```bash
git init
git add .
git commit -m "Deploy to Vercel"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

#### ステップ2: Vercelでインポート

1. https://vercel.com にアクセス
2. GitHubアカウントでサインイン
3. "New Project" をクリック
4. GitHubリポジトリを選択
5. "Deploy" をクリック

**以降、GitHubにプッシュするだけで自動デプロイ！**

---

## 🌐 デプロイ後のURL

```
https://your-project.vercel.app
```

このURLを共有すれば誰でもアクセス可能！

### アクセスURL例

- トップページ: `https://your-project.vercel.app`
- ルーム: `https://your-project.vercel.app/room/test-room`
- テスト: `https://your-project.vercel.app/test.html`

---

## ⚡ クイックスタート

```bash
# 1. デプロイ
npm run deploy-wizard

# 2. 表示されたURLにアクセス

# 3. ルームを作成してテスト

# 4. URLを共有
```

---

## 📊 比較: localhost vs Vercel

| 項目 | localhost | Vercel（Supabase） |
|------|-----------|-------------------|
| サーバー起動 | 必要 | 不要 |
| URL | localhost:3000 | your-app.vercel.app |
| 共有 | ngrok必要 | URLそのまま共有 |
| 自動更新 | 手動 | Git pushで自動 |
| 費用 | 無料 | 無料 |
| 速度 | ローカル | グローバルCDN |

---

## 🔧 環境変数設定（オプション）

現在、Supabase認証情報はHTMLに直接埋め込まれています。
本番環境では環境変数を使うことを推奨します。

### Vercelで環境変数を設定

#### 方法A: CLIで設定

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
```

#### 方法B: ダッシュボードで設定

1. Vercelダッシュボードを開く
2. プロジェクト → Settings → Environment Variables
3. 追加:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

---

## ✅ デプロイ確認チェックリスト

- [ ] URLにアクセスできる
- [ ] ルームページが表示される
- [ ] 複数タブで同時接続できる
- [ ] カーソルがリアルタイムで同期される
- [ ] チャットが送受信できる
- [ ] 参加者一覧が更新される

---

## 🆘 トラブルシューティング

### デプロイは成功したがページが表示されない

```bash
# vercel.jsonが正しいか確認
cat vercel.json

# ビルドログを確認
vercel logs
```

### チャットが送信されない

1. ブラウザのコンソールでエラー確認
2. `https://your-app.vercel.app/test.html` で接続テスト
3. Supabase設定を確認:
   - `messages` テーブルが存在するか
   - RLSポリシーが正しいか
   - Realtimeが有効か

### 「401 Unauthorized」エラー

Supabase Anon Keyが間違っています:
1. Supabaseダッシュボード → Settings → API
2. `anon public` キーをコピー
3. `public/room-v2.html` の `SUPABASE_ANON_KEY` を更新

---

## 🔄 更新方法

### ファイルを更新したら

#### GitHub連携の場合（自動）

```bash
git add .
git commit -m "Update feature"
git push
# → 自動でVercelにデプロイ！
```

#### CLI使用の場合（手動）

```bash
vercel --prod
```

---

## 📖 詳細ドキュメント

- **DEPLOY_TO_VERCEL.md** - 完全なデプロイガイド
- **README.md** - プロジェクト全体のドキュメント
- **QUICKSTART.md** - クイックスタート

---

## 🎯 次のステップ

1. ✅ デプロイ: `npm run deploy-wizard`
2. ✅ URLにアクセスしてテスト
3. ✅ チームメンバーにURL共有
4. ✅ GitHub連携で自動デプロイ設定（オプション）
5. ✅ 環境変数で認証情報を管理（推奨）

---

**これで、localhostサーバー不要でSupabaseだけで動きます！** 🎉
