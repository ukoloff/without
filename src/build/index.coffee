fs = require 'fs'
path = require 'path'

dst = fs.createWriteStream path.join __dirname, '../../without.js'

fs.readdirSync folder = path.join __dirname, '..'
.forEach (file)->
  console.log file
  try dst.write fs.readFileSync path.join folder, file

dst.end()
