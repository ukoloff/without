expect = require 'expect.js'
withOut= require '..'

describe 'Fake source file', ->
  it 'before rendering is null', ->
    x = withOut.compile -> div id: 'A'
    expect(x.id).to.equal null
    expect(x.displayName).to.equal {}.a

  it 'get some name on first render', ->
    x = withOut.compile -> div id: 'A'
    do x
    expect(x.id).to.be.ok()
    expect(x.displayName).to.equal "{{#{x.id}}}"

  it 'can be assigned by user', ->
    x = withOut.compile -> div id: 'A'
    x.id = 'wow'
    do x
    expect(x.id).to.equal 'wow'
    expect(x.displayName).to.equal "{{#{x.id}}}"

  it 'but is normalized on rendering', ->
    x = withOut.compile -> div id: 'A'
    x.id = '+wow!'
    do x
    expect(x.id).to.equal 'wow'
    expect(x.displayName).to.equal "{{#{x.id}}}"

  it 'can have some path inside', ->
    x = withOut -> div id: 'A'
    x.id = ' a b c'
    do x
    expect(x.id).to.equal 'a/b/c'
    expect(x.displayName).to.equal "{{#{x.id}}}"

  it 'is assigned once', ->
    t = withOut -> 0
    expect(t.id).to.equal null
    t.id = 'path to'
    expect(do t).to.equal ''
    expect(n = t.displayName).to.be.ok()
    t.id = 'path#2'
    do t
    expect(t.displayName).to.equal n

  it 'adds count to JSTs.displayName', ->
    x = withOut.JSTs
      a: -> div id: 'a'
      b: -> div id: 'b'
    x.id = 'who there?!'
    do x
    expect(x.id).to.equal 'who/there'
    expect(x.displayName).to.equal "{{#{x.id}[2]}}"
