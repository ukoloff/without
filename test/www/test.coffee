http = require 'http'
url  = require 'url'
fs   = require 'fs'
cc   = require 'coffee-script'

port = 1234

scripts = 
  test:    'test/www'
  expect:  'node_modules/expect.js'
  withOut: '.'

render404 = (rsp)->
  rsp.writeHead 404, 'Content-Type': 'text/plain'
  rsp.end 'Not found'

renderScriptTag = (name)->
  "<script src='#{name}.js'></script>\n"

startJS = (rsp)->
  rsp.writeHead 200, 'Content-Type': 'application/javascript'

renderJS = (rsp, name)->
  unless (f = scripts[name])?
    return render404 rsp
  startJS rsp
  fs.readFile f+'/'+name+'.js', encoding: 'utf8', (err, data)->
    rsp.end data

renderMain = (rsp)->
  rsp.writeHead 200, 'Content-Type': 'text/html'
  rsp.write """
<html><head>
<title>withOut test</title>

"""
  rsp.write renderScriptTag k for k, v of scripts
  rsp.write """
</head><body>
<h1>withOut test</h1>
</body></html>
"""
  rsp.end()

server = (req, rsp)->
  p = url.parse(req.url).pathname

  if '/'==p
    return renderMain rsp

  if /^\/(\w+)\.js$/.test p
    return renderJS rsp, RegExp.$1

  render404 rsp

http.createServer(server).listen port

console.log "Point your browser to:"
for k, v of require('os').networkInterfaces()
  for x in v when x.family=='IPv4'
    console.log " - http://#{x.address}:#{port}"
