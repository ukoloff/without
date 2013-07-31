expect = require 'expect.js'
withOut= require '..'

describe 'print', ->
  it 'renders text verbatim', ->
    expect(withOut.renderable(-> print 'foobar')()).to.equal 'foobar'

  it 'renders numbers', ->
    expect(withOut.renderable(-> print 1)()).to.equal '1'
    expect(withOut.renderable(-> print 0)()).to.equal '0'

  it 'escapes html', ->
    expect(withOut.renderable(-> print '1"2<3&4>5"')()).to.equal '1&quot;2&lt;3&amp;4&gt;5&quot;'

  it 'renders lists', ->
    expect(withOut.renderable(-> print 1, 2, 3, 4, 5)()).to.equal '12345'
