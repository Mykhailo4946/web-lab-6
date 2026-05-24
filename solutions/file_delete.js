const http = require('http');
const fs = require('fs');
const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === 'DELETE' && req.url.startsWith('/data/')) {
    const id = Number(req.url.split('/')[2]);
    
    let fileContent;
    try {
      fileContent = fs.readFileSync('data.json', 'utf8');
    } catch (err) {
      res.statusCode = 500; // Файлу немає
      return res.end('File missing');
    }

    let data;
    try {
      data = JSON.parse(fileContent);
    } catch(err) {
      res.statusCode = 400; // data.json містить невалідний JSON
      return res.end('Invalid JSON in file');
    }

    const itemIndex = data.findIndex(item => item.id === id);

    if (itemIndex === -1) {
      res.statusCode = 404; // Об'єкт не знайдено
      return res.end('Not found');
    }

    // Видаляємо 1 елемент за знайденим індексом
    data.splice(itemIndex, 1);
    
    // Записуємо оновлений масив у файл
    fs.writeFileSync('data.json', JSON.stringify(data));
    
    res.statusCode = 200;
    res.end('Deleted');
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port);