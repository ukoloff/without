###
Build GEM version file
###
fs = require 'fs'
path = require 'path'

mkdirp = require 'mkdirp'

dst = path.join __dirname, '../../rails/lib/without/rails'

mkdirp dst, (err)->
  throw err if err
  fs.writeFile path.join(dst, 'version.rb'), require('./version'), (err)->
    throw err if err
