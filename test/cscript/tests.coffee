fs = require 'fs'
cc = require 'coffee-script'

fs.readdir path=__dirname+'/..', (err, files)->
  if err
    console.log 'throw Error("Cannot get directory listing")'
    return
  for f in files when /\.coffee$/i.test f
    console.log '//-- src:', f
    console.log try cc.compile fs.readFileSync path+'/'+f, encoding: 'utf8' catch e
      cc.compile """
        describe 'test/#{f}', ->
          it 'Line: #{e.location.first_line+1}, column: #{e.location.first_column+1}', ->
            throw SyntaxError('''#{e.message.replace /[\\']/g, '\\$&'}''')
        """
