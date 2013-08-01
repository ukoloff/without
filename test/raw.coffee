expect = require 'expect.js'
withOut= require '..'

describe 'raw', ->
  it 'renders text verbatim', ->
    expect(withOut.compile(-> raw 'foobar')()).to.equal 'foobar'

  it 'renders numbers', ->
    expect(withOut.compile(-> raw 1)()).to.equal '1'
    expect(withOut.compile(-> raw 0)()).to.equal '0'

  it 'preserves html', ->
    expect(withOut.compile(-> raw '1"2<3&4>5"')()).to.equal '1"2<3&4>5"'

  it 'renders lists', ->
    expect(withOut.compile(-> raw 1, 2, 3, 4, 5)()).to.equal '12345'
