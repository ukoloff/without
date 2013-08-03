expect = require 'expect.js'
withOut= require '..'

describe 'print', ->
  it 'renders text verbatim', ->
    expect(withOut.compile(-> print 'foobar')()).to.equal 'foobar'

  it 'renders numbers', ->
    expect(withOut.compile(-> print 1)()).to.equal '1'
    expect(withOut.compile(-> print 0)()).to.equal '0'

  it 'renders booleans', ->
    t=withOut.$compile -> print @x
    expect(t x: 1==1).to.equal 'true'
    expect(t x: 1==2).to.equal 'false'

  it 'escapes html', ->
    expect(withOut.compile(-> print '1"2<3&4>5"')()).to.
      equal '1&quot;2&lt;3&amp;4&gt;5&quot;'

  it 'renders lists', ->
    expect(withOut.compile(-> print 1, 2, 3, 4, 5)()).to.equal '12345'

  it 'accept empty lists', ->
    expect(withOut.compile(-> print())()).to.equal ''

  it 'ingores nullables', ->
    expect(withOut.compile(-> print 1, null, 2, {}.x, 3)()).to.equal '123'
