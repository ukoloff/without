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

  it 'can be assigned by user', ->
    x = withOut.compile -> div id: 'A'
    x.id = 'wow'
    do x
    expect(x.id).to.equal 'wow'

  it 'but is normalized on rendering', ->
    x = withOut.compile -> div id: 'A'
    x.id = '+wow!'
    do x
    expect(x.id).to.equal 'wow'

  it 'can have some path inside', ->
    x = withOut.compile -> div id: 'A'
    x.id = ' a b c'
    do x
    expect(x.id).to.equal 'a/b/c'
