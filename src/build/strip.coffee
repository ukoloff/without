###
Strip // comments
###
split = require 'split'

module.exports = ->
  split (s)->
    if /// ^ \s* (?: // | $ ) ///.test s
      ''
    else
      "#{s}\n"
