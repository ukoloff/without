if process.env.npm_config_www
  require '../www'
else if process.env.npm_config_win
  unless /^win/i.test require('os').platform()
    console.error 'Windows Scripting Host implies Microsoft Windows!'
    process.exit 1
  require 'child_process'
  .spawn 'cscript', ['//NoLogo', 'test/cscript/test.js'], stdio: 'inherit'
  .on 'exit', ->
    console.log 'Exiting...'
else
  require 'child_process'
  .fork 'node_modules/mocha/bin/mocha'
  .on 'exit', ->
    console.log 'Exiting...'
