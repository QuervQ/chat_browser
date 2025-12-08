// React用のSupabaseリアルタイム通信フック
// 使い方: const { messages, members, sendMessage, sendCursor } = useSupabaseRealtime(roomId, user);

import { useEffect, useState, useCallback, useRef } from 'react';

// supabaseRealtime.jsをインポート
// import SupabaseRealtimeManager from './supabaseRealtime';

export function useSupabaseRealtime(roomId, user, config) {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState({});
  const [cursors, setCursors] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  const managerRef = useRef(null);

  useEffect(() => {
    if (!roomId || !user || !config) return;

    // マネージャー初期化
    const manager = new window.SupabaseRealtimeManager(config);
    managerRef.current = manager;

    // イベントリスナー登録
    manager.on('onMessagesLoaded', (msgs) => {
      setMessages(msgs);
    });

    manager.on('onMessageReceived', (message) => {
      setMessages(prev => [...prev, message]);
    });

    manager.on('onMembersUpdate', (membersList) => {
      setMembers(membersList);
    });

    manager.on('onCursorUpdate', (cursor) => {
      setCursors(prev => ({
        ...prev,
        [cursor.user_id]: cursor
      }));
    });

    manager.on('onError', (err) => {
      console.error('Realtime Error:', err);
      setError(err);
    });

    manager.on('onChannelStatus', (status) => {
      console.log('Channel Status:', status);
      if (status.status === 'SUBSCRIBED') {
        setIsConnected(true);
      }
    });

    // ルーム参加
    manager.joinRoom(roomId, user).then(result => {
      if (!result.success) {
        setError(result.error);
      }
    });

    // クリーンアップ
    return () => {
      manager.disconnect();
      managerRef.current = null;
      setIsConnected(false);
    };
  }, [roomId, user?.id, config]);

  // メッセージ送信
  const sendMessage = useCallback(async (content) => {
    if (!managerRef.current) return { success: false, error: 'Not connected' };
    return await managerRef.current.sendMessage(content);
  }, []);

  // カーソル送信
  const sendCursor = useCallback((x, y) => {
    if (!managerRef.current) return;
    managerRef.current.sendCursor(x, y);
  }, []);

  // プレゼンス更新
  const updatePresence = useCallback(async (state) => {
    if (!managerRef.current) return;
    await managerRef.current.updatePresence(state);
  }, []);

  return {
    messages,
    members,
    cursors,
    isConnected,
    error,
    sendMessage,
    sendCursor,
    updatePresence
  };
}

// 使用例:
/*
function ChatRoom({ roomId }) {
  const user = { id: 'user-1', name: 'Alice' };
  const config = {
    url: process.env.REACT_APP_SUPABASE_URL,
    key: process.env.REACT_APP_SUPABASE_KEY
  };

  const { 
    messages, 
    members, 
    cursors,
    isConnected, 
    sendMessage, 
    sendCursor 
  } = useSupabaseRealtime(roomId, user, config);

  const handleSendMessage = async (content) => {
    const result = await sendMessage(content);
    if (!result.success) {
      console.error('送信失敗:', result.error);
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    sendCursor(x, y);
  };

  return (
    <div>
      <div>接続状態: {isConnected ? '接続中' : '切断'}</div>
      
      <div onMouseMove={handleMouseMove} style={{ position: 'relative', height: 400, border: '1px solid #ccc' }}>
        {Object.values(cursors).map(cursor => (
          <div 
            key={cursor.user_id}
            style={{
              position: 'absolute',
              left: `${cursor.x * 100}%`,
              top: `${cursor.y * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {cursor.name}
          </div>
        ))}
      </div>

      <div>
        <h3>参加者 ({Object.keys(members).length})</h3>
        {Object.values(members).map(member => (
          <div key={member[0].user_id}>{member[0].name}</div>
        ))}
      </div>

      <div>
        {messages.map(msg => (
          <div key={msg.id}>
            <strong>{msg.name}</strong>: {msg.content}
          </div>
        ))}
      </div>

      <input onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleSendMessage(e.target.value);
          e.target.value = '';
        }
      }} />
    </div>
  );
}
*/
