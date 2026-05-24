const http = require('http');
const fs = require('fs');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'PUT' && req.url.startsWith('/data/')) {
    // Витягуємо ID з URL і перетворюємо на число
    const id = Number(req.url.split('/')[2]);
    let body = '';
    
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const updates = JSON.parse(body); // Парсимо тіло запиту
        
        let fileContent;
        try {
          fileContent = fs.readFileSync('data.json', 'utf8');
        } catch (err) {
          res.statusCode = 500; // Файлу немає
          return res.end('File missing');
        }

        const data = JSON.parse(fileContent);
        const itemIndex = data.findIndex(item => item.id === id);

        if (itemIndex === -1) {
          res.statusCode = 404; // Об'єкт не знайдено
          return res.end('Not found');
        }

        // Оновлюємо об'єкт (зливаємо старі дані з новими)
        data[itemIndex] = { ...data[itemIndex], ...updates, id: id };
        
        // Записуємо оновлений масив назад у файл
        fs.writeFileSync('data.json', JSON.stringify(data));
        
        res.statusCode = 200;
        res.end('Updated');
      } catch (e) {
        res.statusCode = 400; // Тіло запиту невалідний JSON
        res.end('Invalid JSON');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port);