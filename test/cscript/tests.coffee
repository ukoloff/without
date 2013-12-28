fs = require 'fs'
cc = require 'coffee-script'

fs.readdir path=__dirname+'/..', (err, files)->
  if err
    console.log 'throw Error("Cannot get directory listing")'
    return
  for f in files when /\.coffee$/i.test f
    console.log '//-- src:', f
    console.log cc.compile fs.readFileSync path+'/'+f, encoding: 'utf8'
