http = require 'http'
url  = require 'url'
fs   = require 'fs'
cc   = require 'coffee-script'

port = if /^\d{4,5}$/.test process.env.npm_config_port then process.env.npm_config_port else 1234

scripts =
  test:    __dirname
  expect:  'node_modules/expect.js'
  withOut: '.'

render404 = (rsp)->
  rsp.writeHead 404, 'Content-Type': 'text/plain'
  rsp.end 'Not found'

renderScriptTag = (name)->
  "<script src='#{name}.js'></script>\n"

renderStyle = (rsp)->
  fs.readFile __dirname+'/test.css', (err, data)->
    if err
      return render404 rsp
    rsp.writeHead 200, 'Content-Type': 'text/css'
    rsp.end data

startJS = (rsp)->
  rsp.writeHead 200, 'Content-Type': 'application/javascript'

renderJS = (rsp, name)->
  unless (f = scripts[name])?
    return render404 rsp
  fs.readFile f+'/'+name+'.js', (err, data)->
    if err
      return render404 rsp
    startJS rsp
    rsp.end data

renderTest = (rsp, name)->
  fs.readFile __dirname+'/../'+name+'.coffee', encoding: 'utf8', (err, data)->
    if err
      return render404 rsp
    startJS rsp
    rsp.end try cc.compile data catch e
      cc.compile """
        describe 'test/#{name}', ->
          it 'Line: #{e.location.first_line+1}, column: #{e.location.first_column+1}', ->
            throw SyntaxError('''#{e.message.replace /[\\']/g, '\\$&'}''')
        """

renderMain = (rsp)->
  rsp.writeHead 200, 'Content-Type': 'text/html'
  html = []
  fs.readFile __dirname+'/test.html', encoding: 'utf8', (err, data)->
    html = data.split /<#include>\s*/, 3
    rsp.write html[0]
    rsp.write renderScriptTag k for k, v of scripts
    rsp.write html[1]
    fs.readdir __dirname+'/..', (err, data)->
      for f in data when /\.coffee$/.test f
        rsp.write renderScriptTag 'test/'+RegExp.leftContext
      rsp.write html[2]
      rsp.end()

server = (req, rsp)->
  p = url.parse(req.url).pathname

  if '/'==p
    return renderMain rsp

  if '/test.css'==p
    return renderStyle rsp

  if /^\/(\w+)\.js$/.test p
    return renderJS rsp, RegExp.$1

  if /^\/test\/(\w+)\.js$/.test p
    return renderTest rsp, RegExp.$1

  render404 rsp

http.createServer(server).listen port

console.log "Point your browser to:"
for k, v of require('os').networkInterfaces()
  for x in v when x.family=='IPv4'
    console.log " - http://#{x.address}:#{port}"
