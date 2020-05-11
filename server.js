/**
 * 精简版静态文件服务器
 */
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const server = http.createServer()

const port = 2757

server.on('request', (req, res) => {
  // 请求路径
  let { pathname } = url.parse(req.url, true)

  // 文件路径
  let filepath = path.join(__dirname, pathname)
  
  // 读取文件
  fs.readFile(filepath, (err, data) => {
    try {
      if (err) {
        res.writeHead(404)
        res.end('NOT FOUND')
      } else {
        res.writeHead(200)
        res.end(data)
      }      
    } catch (error) {
      console.log(error)
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      res.writeHead(500)
      res.end('服务器异常')
    }
  })
})

server.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`)
})