expect = require 'expect.js'
withOut= require '..'

describe 'print', ->
  it 'renders text verbatim', ->
    expect(withOut.renderable(-> print 'foobar')()).to.equal 'foobar'

  it 'renders numbers', ->
    expect(withOut.renderable(-> print 1)()).to.equal '1'
    expect(withOut.renderable(-> print 0)()).to.equal '0'
