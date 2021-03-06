child_process = require 'child_process'

require '../build'

wait = (child)->
  child.on 'exit', (code, signal)->
    if signal
      process.kill process.pid, signal
    else
      process.exit code

if process.env.npm_config_www
  require '../www'
else if param = process.env.npm_config_win
  unless /^win/i.test require('os').platform()
    console.error 'Windows Scripting Host implies Microsoft Windows!'
    process.exit 1
  wait child_process.spawn 'cscript', ['//NoLogo', 'test/cscript/test.js', param], stdio: 'inherit'
else
  wait child_process.spawn process.argv[0], ['node_modules/mocha/bin/mocha'], stdio: 'inherit'
