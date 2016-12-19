fs = require 'fs'
path = require 'path'
pckg = require '../../package'

dst = fs.createWriteStream path.join __dirname, '../../', pckg.main

dst.write """
//
// #{pckg.name}.js v#{pckg.version}: #{pckg.description}
//
!function(){

"""

fs.readdirSync folder = path.join __dirname, '..'
.forEach (file)->
  try dst.write fs.readFileSync path.join folder, file

dst.write """
}
//--[EOF]------------------------------------------------------------

"""

dst.end()
