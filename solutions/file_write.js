const http = require('http');
const fs = require('fs');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        // Перевіряємо, чи валідний JSON прийшов у тілі запиту
        const parsed = JSON.parse(body);
        
        // Зберігаємо у файл
        fs.writeFileSync('data.json', JSON.stringify(parsed));
        
        res.statusCode = 200;
        res.end('Saved successfully');
      } catch (e) {
        // Якщо JSON невалідний
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port);