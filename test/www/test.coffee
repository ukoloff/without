http = require 'http'
url  = require 'url'

port = 1234

server = (req, rsp)->
  rsp.writeHead 200, 'Content-Type': 'text/plain'
  rsp.end 'Hello World\n'

http.createServer(server).listen port

console.log "Point your browser to:"
for k, v of require('os').networkInterfaces()
  for x in v when x.family=='IPv4'
    console.log " - http://#{x.address}:#{port}"
