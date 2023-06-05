import fs from "fs"
import http from "http"

const testPageServer = http.createServer(function (req, res) {
  fs.readFile(`${__dirname}/test-pages${req.url}`, function (err, data) {
    if (err) {
      res.writeHead(404)
      res.end(JSON.stringify(err))
      return
    }
    res.writeHead(200)
    res.end(data)
  })
})

export default testPageServer
