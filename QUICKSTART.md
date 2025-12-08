# 🚀 クイックスタート

## 今すぐ始める（3ステップ）

### ステップ1: ローカルで起動

```bash
npm run serve
```

ブラウザで `http://localhost:3000` を開く

### ステップ2: テスト

1. ルーム名を入力（例: `test-room`）して入室
2. 別のタブで同じルームに入室
3. カーソルを動かしてみる
4. チャットを送信してみる

### ステップ3: 他の人と共有（オプション）

#### 方法A: ngrok（簡単・推奨）

```bash
npm run share
```

`y` を入力すると公開URLが表示されます。

**初回のみ**: ngrokのAuthtoken設定が必要
1. https://dashboard.ngrok.com/signup でアカウント作成（無料）
2. Authtokenをコピー
3. `ngrok config add-authtoken YOUR_TOKEN` を実行

#### 方法B: 手動起動

```bash
# ターミナル1
node server.js

# ターミナル2
ngrok http 3000
```

表示されたURL（例: `https://abc123.ngrok.io`）を共有すればOK！

---

## 🎯 URL一覧

| URL | 説明 |
|-----|------|
| `http://localhost:3000` | トップページ |
| `http://localhost:3000/room/[roomId]` | ルームページ |
| `http://localhost:3000/test.html` | Supabase接続テスト |

---

## 🔧 トラブルシューティング

### ポート3000が使用中

```bash
# プロセスを停止
lsof -ti:3000 | xargs kill -9

# 再起動
npm run serve
```

### ngrokが動かない

```bash
# インストール確認
which ngrok

# 未インストールの場合
brew install ngrok/ngrok/ngrok

# Authtoken設定
ngrok config add-authtoken YOUR_TOKEN
```

### チャットが送信されない

1. `http://localhost:3000/test.html` で接続テスト
2. エラーメッセージを確認
3. Supabaseダッシュボードで `messages` テーブルを確認

---

## 📦 チームメンバー向け

### コアモジュールの使い方

```javascript
// src/supabaseRealtime.js をインポート
const manager = new SupabaseRealtimeManager({
  url: 'YOUR_SUPABASE_URL',
  key: 'YOUR_SUPABASE_KEY'
});

// イベントリスナー
manager.on('onMessageReceived', (msg) => {
  console.log('新しいメッセージ:', msg);
});

// ルーム参加
await manager.joinRoom('room-id', { 
  id: 'user-1', 
  name: 'Alice' 
});

// メッセージ送信
await manager.sendMessage('Hello!');

// カーソル送信
manager.sendCursor(0.5, 0.5);
```

詳細: [README_REALTIME.md](README_REALTIME.md)

---

## ✅ 環境確認

```bash
./check-env.sh
```

このスクリプトで必要な環境が揃っているか確認できます。

---

## 📝 次のステップ

1. ✅ ローカルで動作確認
2. ✅ 他の人と共有してテスト
3. 📖 [README_REALTIME.md](README_REALTIME.md) でAPI詳細を確認
4. 🔧 React/Electron/WebRTCと統合
5. 🚀 本番環境にデプロイ（[DEPLOY.md](DEPLOY.md)）

---

質問があれば README.md を参照してください！
