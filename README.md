# 🚀 Supabase Realtime Communication App

WebRTC/Electron/Reactと統合可能なSupabaseリアルタイム通信システム

## ✨ 機能

- 🖱️ **リアルタイムカーソル共有** - マウス移動が瞬時に同期
- 💬 **リアルタイムチャット** - メッセージが即座に届く
- 👥 **参加者管理** - オンラインユーザーをリアルタイム表示
- 🔌 **モジュール化** - React、Electron、WebRTCと簡単に統合

## 🎯 あなたの担当範囲

- ✅ Supabaseのリアルタイム通信（カーソル、チャット、参加者一覧）
- ✅ WebRTC/Electron/React UIと統合できるモジュール設計

## 📦 インストール

```bash
# 依存関係のインストール
npm install

# または
yarn install
```

## 🚀 起動方法

### 方法1: シンプル起動（ローカルのみ）

```bash
npm run serve
```

`http://localhost:3000` でアクセス

### 方法2: 外部公開（他の人と共有）

```bash
npm run share
```

このコマンドで：
1. サーバーが起動
2. ngrokで外部公開するか選択できます
3. `https://xxx.ngrok.io` のようなURLが表示される
4. そのURLを共有すれば誰でもアクセス可能！

### 方法3: 手動で起動

```bash
# ターミナル1: サーバー起動
node server.js

# ターミナル2: ngrokで公開（オプション）
ngrok http 3000
```

## 📂 プロジェクト構成

```
├── src/
│   └── supabaseRealtime.js       # コアモジュール（他メンバーに共有）
├── public/
│   ├── room-v2.html               # デモページ（モジュール使用）
│   ├── test.html                  # Supabase接続テスト
│   └── index.html                 # トップページ
├── examples/
│   ├── useSupabaseRealtime.jsx   # React Hook
│   ├── electron-main.js          # Electron統合例
│   └── electron-preload.js       # Electronプリロード
├── server.js                      # Expressサーバー
└── README_REALTIME.md            # 詳細ドキュメント
```

## 🎮 使い方

### 1. ブラウザでテスト

1. サーバーを起動: `npm run serve`
2. ブラウザで開く: `http://localhost:3000`
3. 任意のルーム名を入力して入室
4. 別のタブ/ブラウザで同じルームに入室
5. カーソルを動かしたり、チャットを送信してテスト

### 2. 他の人と共有

1. サーバーを起動: `npm run share`
2. `y` を入力してngrokを有効化
3. 表示されたURL（例: `https://abc123.ngrok.io`）を共有
4. 相手は `https://abc123.ngrok.io/room/test-room` にアクセス

### 3. 接続テスト

Supabaseの設定を確認:
```
http://localhost:3000/test.html
```

## 🔧 環境変数

Supabase認証情報は `public/room-v2.html` と `src/supabaseRealtime.js` に直接埋め込まれています。

本番環境では環境変数で管理することを推奨:

```bash
# .env.local
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 👥 チームメンバーへの統合

### React統合

```jsx
import { useSupabaseRealtime } from './examples/useSupabaseRealtime';

function ChatRoom({ roomId }) {
  const { messages, members, sendMessage } = useSupabaseRealtime(
    roomId,
    { id: 'user-1', name: 'Alice' },
    { url: SUPABASE_URL, key: SUPABASE_KEY }
  );

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

### Electron統合

```javascript
// main.js
const SupabaseRealtimeManager = require('./src/supabaseRealtime');

const manager = new SupabaseRealtimeManager({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY
});

manager.on('onMessageReceived', (msg) => {
  mainWindow.webContents.send('new-message', msg);
});
```

### WebRTC統合

```javascript
// WebRTC状態をプレゼンスに反映
peerConnection.addEventListener('connectionstatechange', () => {
  manager.updatePresence({
    webrtc_state: peerConnection.connectionState,
    video_enabled: localStream.getVideoTracks()[0]?.enabled
  });
});
```

## 📖 詳細ドキュメント

- **[README_REALTIME.md](README_REALTIME.md)** - 完全なAPIリファレンス
- **[DEPLOY.md](DEPLOY.md)** - デプロイ方法
- **[examples/](examples/)** - React、Electronの統合例

## 🔗 主要ファイル

### `src/supabaseRealtime.js` - コアモジュール

他のメンバーに共有するメインファイル。以下の機能を提供:

- `joinRoom(roomId, user)` - ルームに参加
- `sendMessage(content)` - メッセージ送信
- `sendCursor(x, y)` - カーソル位置送信
- `on(event, callback)` - イベントリスナー登録
- `disconnect()` - 接続切断

### イベント一覧

- `onMembersUpdate` - 参加者が変更された
- `onCursorUpdate` - カーソルが移動した
- `onMessageReceived` - 新しいメッセージを受信
- `onMessagesLoaded` - 初期メッセージ読み込み完了
- `onError` - エラーが発生
- `onChannelStatus` - 接続状態が変化

## 🛠️ トラブルシューティング

### チャットが送信されない

1. `http://localhost:3000/test.html` で接続テスト
2. Supabaseダッシュボードで確認:
   - `messages`テーブルが存在するか
   - RLSポリシーで読み書き権限があるか
   - Realtimeが有効か（Database > Replication）

### ngrokが動かない

```bash
# ngrokのインストール確認
which ngrok

# インストール
brew install ngrok/ngrok/ngrok

# アカウント作成とAuthtoken設定
# https://dashboard.ngrok.com/signup
ngrok config add-authtoken YOUR_TOKEN
```

### ポート3000が使用中

```bash
# プロセスを停止
lsof -ti:3000 | xargs kill -9

# または別のポートを使用
PORT=3001 node server.js
```

## 🚀 デプロイ（本番環境）

### Vercel（推奨）

```bash
npm install -g vercel
vercel login
vercel
```

### その他のオプション

- **Cloudflare Pages** - 高速CDN
- **Railway** - 簡単デプロイ
- **Render** - 無料枠あり

詳細は [DEPLOY.md](DEPLOY.md) を参照

## 📝 Supabaseテーブル設定

```sql
-- messagesテーブル作成
create table messages (
  id uuid default gen_random_uuid() primary key,
  room_id text not null,
  user_id text not null,
  name text,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Realtimeを有効化
alter publication supabase_realtime add table messages;

-- RLSポリシー（全員が読み書き可能）
alter table messages enable row level security;

create policy "Anyone can read messages"
  on messages for select using (true);

create policy "Anyone can insert messages"
  on messages for insert with check (true);
```

## 🤝 チーム開発での役割分担

| 担当 | 範囲 | ファイル |
|------|------|----------|
| **あなた** | Supabaseリアルタイム通信 | `src/supabaseRealtime.js` |
| WebRTC担当 | P2P接続、音声/映像 | - |
| Electron担当 | デスクトップアプリUI | `examples/electron-*.js` |
| React UI担当 | Webアプリケーション | `examples/useSupabaseRealtime.jsx` |

## 📞 サポート

質問があれば:
1. [README_REALTIME.md](README_REALTIME.md) を確認
2. [examples/](examples/) のサンプルコードを参照
3. `http://localhost:3000/test.html` で接続テスト

## ライセンス

MIT
