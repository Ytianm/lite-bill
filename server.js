const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  console.log(req.url);
  if (req.url === '/home') {
    console.log('home');
    fs.readFile('./index.html', res => {
      res.write(res)
    })
  }
  res.end()
}).listen(2757)