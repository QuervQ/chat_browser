const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'room-v3.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // 環境変数から読み込み
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  // .env.localファイルから読み込み（ローカル開発用）
  const envPath = path.join(process.cwd(), '.env.local');
  if ((!supabaseUrl || !supabaseKey) && fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      
      for (const line of lines) {
        if (!supabaseUrl && line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
          const value = line.split('=')[1].trim().replace(/["']/g, '');
          if (value) supabaseUrl = value;
        }
        if (!supabaseKey && line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
          const value = line.split('=')[1].trim().replace(/["']/g, '');
          if (value) supabaseKey = value;
        }
      }
    } catch (error) {
      console.error('Error reading .env.local:', error);
    }
  }
  
  // 環境変数が設定されていない場合はエラーを表示
  if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Supabase credentials not found!');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('In Vercel: Settings > Environment Variables');
    console.error('Locally: Create .env.local file');
  }
  
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'NOT FOUND');
  
  // HTMLに注入
  html = html.replace('YOUR_SUPABASE_URL', supabaseUrl);
  html = html.replace('YOUR_SUPABASE_ANON_KEY', supabaseKey);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
