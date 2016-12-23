expect = require 'expect.js'
withOut= require '..'

describe 'Invalid locals', ->
  it 'are errors', ->
    expect(withOut -> oops true).to.throwError()

describe 'Locals', ->

  it 'are injected into templates', ->

    withOut.locals = secret: 6*7
    expect(do withOut -> i secret).to.equal '<i>42</i>'
    delete withOut.locals

  it 'check their names', ->
    z = (name)->
      t = withOut ->
      t.locals = "#{name}": 1
      expect(t).to.throwError (e)->
        expect(e).to.be.a SyntaxError
    z 'a b'
    z 'a.'
    z '-a'
    z ''

  it 'allow $ in names', ->
    t = withOut ->
      i
        a: $a
        b: b$
        $: $
    t.locals =
      $: 27
      $a: 42
      b$: 108
    expect(do t).to.equal '<i a="42" b="108" $="27"></i>'
