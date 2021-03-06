http = require 'http'
url  = require 'url'
fs   = require 'fs'
cc   = require 'coffee-script'
opener = require "opener"

port = if /^\d{4,5}$/.test process.env.npm_config_www then process.env.npm_config_www else 1234

scripts =
  expect:  'expect.js'
  without: '../..'
  mocha:   'mocha/mocha.js'
  test:    './test.js'

render404 = (rsp)->
  rsp.writeHead 404, 'Content-Type': 'text/plain'
  rsp.end 'Not found'

renderScriptTag = (name)->
  "<script src='#{name}.js'></script>\n"

renderStyle = (rsp)->
  fs.createReadStream __dirname+'/test.css'
  .on 'error', -> render404 rsp
  .on 'open', ->
    rsp.writeHead 200, 'Content-Type': 'text/css'
    @pipe rsp

startJS = (rsp)->
  rsp.writeHead 200, 'Content-Type': 'application/javascript'

renderJS = (rsp, name)->
  unless (f = scripts[name])?
    return render404 rsp
  fs.createReadStream require.resolve f
  .on 'error', -> render404 rsp
  .on 'open', ->
    @pipe rsp
    startJS rsp

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
  rsp.writeHead 200, 'Content-Type': 'text/html; charset=utf-8'
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

renderQuit = (rsp)->
  rsp.writeHead 200, 'Content-Type': 'text/html'
  rsp.end()
  process.exit 0

server = (req, rsp)->
  if 'POST'==req.method
    return renderQuit rsp

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

opener "http://127.0.0.1:#{port}"
