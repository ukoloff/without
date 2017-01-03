fs = require 'fs'
path = require 'path'

mkdirp = require 'mkdirp'

pckg = require '../../package'
strip = require './strip'
require './ver'

dst = fs.createWriteStream js = path.join __dirname, '../../', pckg.main

dst.on 'finish', ->
  assets = path.join __dirname, '../../rails/vendor/assets/javascripts'
  mkdirp assets, (err)->
    throw err if err
    fs.createReadStream js
    .pipe fs.createWriteStream js = path.join assets, pckg.main
    .on 'error', ->
      throw Error 'File copy error:', js

dst.write """
//
// #{pckg.main} v#{pckg.version}: #{pckg.description}
// #{pckg.homepage}
//
!function(){

"""

out = strip()
out.pipe dst
dst = out

fs.readdirSync folder = path.join __dirname, '..'
.forEach (file)->
  try
    dst.write fs.readFileSync path.join folder, file

dst.write """
}();
"""

dst.end()
