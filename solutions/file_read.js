const http = require('http');
const fs = require('fs');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/data') {
    try {
      // Читаємо файл
      const fileContent = fs.readFileSync('data.json', 'utf8');
      // Парсимо JSON
      const data = JSON.parse(fileContent);
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    } catch (err) {
      // Якщо файлу не існує, повертаємо 500, якщо JSON зламаний - 400
      if (err.code === 'ENOENT') {
        res.statusCode = 500;
        res.end('File not found');
      } else {
        res.statusCode = 400;
        res.end('Invalid JSON in file');
      }
    }
  } else {
    // Запобіжник від зависання
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, () => console.log(`Сервер на порту ${port}`));