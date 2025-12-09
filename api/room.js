const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'room-v3.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // 環境変数を注入
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  html = html.replace('YOUR_SUPABASE_URL', supabaseUrl);
  html = html.replace('YOUR_SUPABASE_ANON_KEY', supabaseKey);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
