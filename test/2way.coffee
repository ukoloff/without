expect = require 'expect.js'
withOut= require '..'

describe '$compile', ->
  it 'uses both call styles', ->
    expect(withOut((data)-> print @X, '=', data.X) X: 'word').to.equal 'word=word'

