expect = require 'expect.js'
withOut= require '..'

describe 'Tags', ->
  it 'can be used as upvars', ->
    t = withOut ->
      i.n ||= 0
      text ++i.n
    for j in [1..5]
      expect(do t).to.equal "#{j}"
