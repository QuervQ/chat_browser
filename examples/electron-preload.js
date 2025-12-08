// Electron Preload Script
// レンダラープロセスとメインプロセス間の安全な通信

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('supabaseRealtime', {
  // ルーム参加
  joinRoom: (roomId, user) => ipcRenderer.invoke('realtime:join-room', roomId, user),
  
  // メッセージ送信
  sendMessage: (content) => ipcRenderer.invoke('realtime:send-message', content),
  
  // カーソル送信
  sendCursor: (x, y) => ipcRenderer.invoke('realtime:send-cursor', x, y),
  
  // プレゼンス更新
  updatePresence: (state) => ipcRenderer.invoke('realtime:update-presence', state),
  
  // 切断
  disconnect: () => ipcRenderer.invoke('realtime:disconnect'),

  // イベントリスナー
  onMessage: (callback) => ipcRenderer.on('realtime:message', (event, message) => callback(message)),
  onMessagesLoaded: (callback) => ipcRenderer.on('realtime:messages-loaded', (event, messages) => callback(messages)),
  onMembers: (callback) => ipcRenderer.on('realtime:members', (event, members) => callback(members)),
  onCursor: (callback) => ipcRenderer.on('realtime:cursor', (event, cursor) => callback(cursor)),
  onError: (callback) => ipcRenderer.on('realtime:error', (event, error) => callback(error)),
  onStatus: (callback) => ipcRenderer.on('realtime:status', (event, status) => callback(status)),

  // リスナー削除
  removeListener: (channel) => ipcRenderer.removeAllListeners(channel)
});

// WebRTC用のAPI（統合例）
contextBridge.exposeInMainWorld('webrtc', {
  stateChanged: (state) => ipcRenderer.send('webrtc:state-changed', state)
});
