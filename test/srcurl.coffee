expect = require 'expect.js'
withOut= require '..'

describe 'Fake source file', ->
  it 'before rendering is null', ->
    x = withOut.compile -> div id: 'A'
    expect(x.id).to.equal(null)

  it 'get some name on first render', ->
    x = withOut.compile -> div id: 'A'
    do x
    expect(x.id).to.be.ok()
