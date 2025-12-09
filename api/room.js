const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'room-v3.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // 環境変数を注入（.envファイルから読み込み）
  const envPath = path.join(process.cwd(), '.env.local');
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // 環境変数が設定されていない場合、.env.localから直接読み込む
  if (!supabaseUrl && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=["']?([^"'\n\r]+)["']?/);
    const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=["']?([^"'\n\r]+)["']?/);
    
    if (urlMatch) supabaseUrl = urlMatch[1].trim();
    if (keyMatch) supabaseKey = keyMatch[1].trim();
  }
  
  // フォールバック: 環境変数が見つからない場合のデフォルト値
  if (!supabaseUrl) {
    supabaseUrl = 'https://wzjasatwikzfwfnudxkm.supabase.co';
  }
  if (!supabaseKey) {
    supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6amFzYXR3aWt6ZndmbnVkeGttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNTkwMzksImV4cCI6MjA4MDczNTAzOX0.YtUCl1dQc4JlBP4Nvkuki2UHtYCfe98I8uGrIQ0Ehic';
  }
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NOT FOUND');
  
  html = html.replace('YOUR_SUPABASE_URL', supabaseUrl);
  html = html.replace('YOUR_SUPABASE_ANON_KEY', supabaseKey);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
