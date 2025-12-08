const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルを提供
app.use(express.static('public'));
app.use('/src', express.static('src'));

// ルームページへのルーティング（v2を使用）
app.get('/room/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room-v2.html'));
});

// 旧バージョン（デバッグ用）
app.get('/room-old/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

// ルートページ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Supabase Realtime Module: /src/supabaseRealtime.js`);
  console.log(`🔗 Room URL: http://localhost:${PORT}/room/[roomId]`);
});
