# Supabase Realtime Manager

WebRTC/Electron/Reactと統合可能なSupabaseリアルタイム通信モジュール

## 機能

- ✅ **カーソル共有** - リアルタイムでカーソル位置を共有
- ✅ **チャット** - メッセージのリアルタイム送受信
- ✅ **参加者一覧** - オンラインユーザーの管理
- ✅ **モジュール化** - React、Electron、WebRTCと簡単に統合

## ファイル構成

```
src/
  └── supabaseRealtime.js       # コアモジュール
public/
  ├── room-v2.html               # デモページ（モジュール使用）
  ├── room.html                  # 旧バージョン
  └── index.html                 # トップページ
server.js                        # Expressサーバー
```

## 起動方法

```bash
node server.js
```

`http://localhost:3000` にアクセス

## 使い方

### 1. ブラウザ（バニラJS）

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/src/supabaseRealtime.js"></script>

<script>
const manager = new SupabaseRealtimeManager({
  url: 'YOUR_SUPABASE_URL',
  key: 'YOUR_SUPABASE_KEY'
});

// イベントリスナー登録
manager.on('onMessageReceived', (message) => {
  console.log('新しいメッセージ:', message);
});

manager.on('onCursorUpdate', (cursor) => {
  console.log('カーソル移動:', cursor);
});

manager.on('onMembersUpdate', (members) => {
  console.log('参加者更新:', members);
});

// ルーム参加
await manager.joinRoom('room-123', { 
  id: 'user-1', 
  name: 'Alice' 
});

// メッセージ送信
await manager.sendMessage('こんにちは！');

// カーソル送信
manager.sendCursor(0.5, 0.5); // x, y (0-1の範囲)

// 切断
manager.disconnect();
</script>
```

### 2. React

```jsx
import { useEffect, useState } from 'react';
import SupabaseRealtimeManager from './supabaseRealtime.js';

function ChatRoom({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const [manager, setManager] = useState(null);

  useEffect(() => {
    const rtManager = new SupabaseRealtimeManager({
      url: process.env.REACT_APP_SUPABASE_URL,
      key: process.env.REACT_APP_SUPABASE_KEY
    });

    // イベントリスナー
    rtManager.on('onMessageReceived', (message) => {
      setMessages(prev => [...prev, message]);
    });

    rtManager.on('onMessagesLoaded', (msgs) => {
      setMessages(msgs);
    });

    rtManager.on('onError', (error) => {
      console.error('エラー:', error);
    });

    // ルーム参加
    rtManager.joinRoom(roomId, user);
    setManager(rtManager);

    // クリーンアップ
    return () => rtManager.disconnect();
  }, [roomId, user]);

  const sendMessage = async (content) => {
    if (manager) {
      await manager.sendMessage(content);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.name}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input onKeyPress={(e) => {
        if (e.key === 'Enter') {
          sendMessage(e.target.value);
          e.target.value = '';
        }
      }} />
    </div>
  );
}
```

### 3. Node.js（バックエンド）

```javascript
const { createClient } = require('@supabase/supabase-js');

class SupabaseRealtimeManager {
  // ... (同じコード)
}

// 使用例
const manager = new SupabaseRealtimeManager({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_KEY
});

manager.on('onMessageReceived', (message) => {
  console.log('新しいメッセージ:', message);
  // Slack通知、メール送信などの処理
});

manager.joinRoom('room-123', { 
  id: 'bot-1', 
  name: 'Bot' 
});
```

### 4. Electron（メインプロセス）

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const SupabaseRealtimeManager = require('./src/supabaseRealtime.js');

let manager;

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  manager = new SupabaseRealtimeManager({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  });

  // レンダラープロセスにメッセージを転送
  manager.on('onMessageReceived', (message) => {
    mainWindow.webContents.send('new-message', message);
  });

  // IPCハンドラー
  ipcMain.handle('join-room', async (event, roomId, user) => {
    return await manager.joinRoom(roomId, user);
  });

  ipcMain.handle('send-message', async (event, content) => {
    return await manager.sendMessage(content);
  });

  mainWindow.loadFile('index.html');
});
```

## API リファレンス

### コンストラクタ

```javascript
new SupabaseRealtimeManager(config)
```

- `config.url` - Supabase URL
- `config.key` - Supabase匿名キー

### メソッド

#### `on(event, callback)`
イベントリスナーを登録

**イベント一覧:**
- `onMembersUpdate(members)` - 参加者リストが更新された
- `onCursorUpdate(cursor)` - カーソルが移動した
- `onMessageReceived(message)` - 新しいメッセージを受信
- `onMessagesLoaded(messages)` - 初期メッセージを読み込んだ
- `onError(error)` - エラーが発生した
- `onChannelStatus(status)` - チャンネル状態が変化した

#### `joinRoom(roomId, user)`
ルームに参加

- `roomId` - ルームID（文字列）
- `user` - ユーザー情報 `{ id, name }`
- 戻り値: `Promise<{ success, data?, error? }>`

#### `sendMessage(content)`
メッセージを送信

- `content` - メッセージ内容（文字列）
- 戻り値: `Promise<{ success, data?, error? }>`

#### `sendCursor(x, y)`
カーソル位置を送信

- `x` - X座標（0-1の範囲）
- `y` - Y座標（0-1の範囲）

#### `updatePresence(state)`
プレゼンス情報を更新

- `state` - 更新する状態（オブジェクト）

#### `disconnect()`
接続を切断

#### `getStatus()`
現在の接続状態を取得

- 戻り値: `{ roomId, user, isConnected }`

## WebRTCとの統合例

```javascript
// WebRTC接続時にプレゼンス情報を更新
peerConnection.addEventListener('connectionstatechange', () => {
  manager.updatePresence({
    webrtc_state: peerConnection.connectionState,
    video_enabled: localStream.getVideoTracks()[0]?.enabled,
    audio_enabled: localStream.getAudioTracks()[0]?.enabled
  });
});

// チャットでWebRTC制御コマンドを送信
manager.on('onMessageReceived', (message) => {
  if (message.content === '/mute') {
    localStream.getAudioTracks()[0].enabled = false;
  }
});
```

## Supabaseテーブル設定

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

-- RLSポリシー
alter table messages enable row level security;

create policy "Anyone can read messages"
  on messages for select
  using (true);

create policy "Anyone can insert messages"
  on messages for insert
  with check (true);
```

## チームメンバーへの共有

1. **`src/supabaseRealtime.js`をコピー**してプロジェクトに追加
2. **Supabase設定**を環境変数で管理
3. **イベントリスナー**を登録して使用

各自の担当部分（WebRTC、Electron UI、React UI）に簡単に組み込めます！

## トラブルシューティング

### チャットが送信されない
1. Supabaseダッシュボードで`messages`テーブルが存在するか確認
2. RLSポリシーで書き込み権限があるか確認
3. Realtimeが有効か確認（Database > Replication）

### カーソルが表示されない
- ブラウザのコンソールでエラーを確認
- チャンネル接続状態を確認: `onChannelStatus`イベント

### 参加者が表示されない
- Presenceチャンネルが正しく購読されているか確認
- `joinRoom()`が正常に完了しているか確認

## ライセンス

MIT
