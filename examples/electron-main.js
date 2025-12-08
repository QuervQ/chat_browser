// Electron統合例
// メインプロセスでSupabaseリアルタイム通信を管理

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const SupabaseRealtimeManager = require('../src/supabaseRealtime');

let mainWindow;
let realtimeManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

// Supabase Realtime Manager初期化
function initRealtimeManager() {
  realtimeManager = new SupabaseRealtimeManager({
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  });

  // メッセージ受信時にレンダラープロセスに転送
  realtimeManager.on('onMessageReceived', (message) => {
    mainWindow.webContents.send('realtime:message', message);
  });

  realtimeManager.on('onMessagesLoaded', (messages) => {
    mainWindow.webContents.send('realtime:messages-loaded', messages);
  });

  realtimeManager.on('onMembersUpdate', (members) => {
    mainWindow.webContents.send('realtime:members', members);
  });

  realtimeManager.on('onCursorUpdate', (cursor) => {
    mainWindow.webContents.send('realtime:cursor', cursor);
  });

  realtimeManager.on('onError', (error) => {
    mainWindow.webContents.send('realtime:error', error);
  });

  realtimeManager.on('onChannelStatus', (status) => {
    mainWindow.webContents.send('realtime:status', status);
  });
}

// IPCハンドラー
ipcMain.handle('realtime:join-room', async (event, roomId, user) => {
  if (!realtimeManager) {
    initRealtimeManager();
  }
  return await realtimeManager.joinRoom(roomId, user);
});

ipcMain.handle('realtime:send-message', async (event, content) => {
  if (!realtimeManager) {
    return { success: false, error: 'Not connected' };
  }
  return await realtimeManager.sendMessage(content);
});

ipcMain.handle('realtime:send-cursor', (event, x, y) => {
  if (realtimeManager) {
    realtimeManager.sendCursor(x, y);
  }
});

ipcMain.handle('realtime:update-presence', async (event, state) => {
  if (realtimeManager) {
    await realtimeManager.updatePresence(state);
  }
});

ipcMain.handle('realtime:disconnect', () => {
  if (realtimeManager) {
    realtimeManager.disconnect();
    realtimeManager = null;
  }
});

// アプリケーションライフサイクル
app.whenReady().then(() => {
  createWindow();
  initRealtimeManager();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (realtimeManager) {
    realtimeManager.disconnect();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// WebRTCとの統合例
ipcMain.on('webrtc:state-changed', (event, state) => {
  // WebRTC接続状態をSupabaseのプレゼンスに反映
  if (realtimeManager) {
    realtimeManager.updatePresence({
      webrtc_state: state.connectionState,
      video_enabled: state.videoEnabled,
      audio_enabled: state.audioEnabled
    });
  }
});
