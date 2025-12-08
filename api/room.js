const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'public', 'room-v3.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
