const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'room-v3.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // デフォルト値（必ず設定される）
  let supabaseUrl = 'https://wzjasatwikzfwfnudxkm.supabase.co';
  let supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6amFzYXR3aWt6ZndmbnVkeGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTkwMzksImV4cCI6MjA4MDczNTAzOX0.YtUCl1dQc4JlBP4Nvkuki2UHtYCfe98I8uGrIQ0Ehic';
  
  // 環境変数が設定されている場合は上書き
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  }
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
  
  // .env.localファイルから読み込み（ローカル開発用）
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
          const value = line.split('=')[1].trim().replace(/["']/g, '');
          if (value) supabaseUrl = value;
        }
        if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
          const value = line.split('=')[1].trim().replace(/["']/g, '');
          if (value) supabaseKey = value;
        }
      }
    } catch (error) {
      console.error('Error reading .env.local:', error);
    }
  }
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NOT FOUND');
  
  // HTMLに注入
  html = html.replace('YOUR_SUPABASE_URL', supabaseUrl);
  html = html.replace('YOUR_SUPABASE_ANON_KEY', supabaseKey);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
