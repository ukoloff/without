expect = require 'expect.js'
withOut= require '..'

describe 'Empty tag', ->
  it 'render', ->
    expect(withOut.compile(-> br())()).to.equal '<br>'

  it 'render attributes', ->
    expect(withOut.compile(-> hr align: 'right')()).to.equal '<hr align="right">'
    expect(withOut.compile(-> hr size: null)()).to.equal '<hr>'

  it 'allows no content', ->
    expect(withOut.compile -> hr name: 'A', 'Hello').to.throwException()
