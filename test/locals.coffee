expect = require 'expect.js'
withOut= require '..'

describe 'Invalid locals', ->
  it 'are errors', ->
    expect(withOut -> oops true).to.throwError()

describe 'Locals', ->

  describe 'are injected into templates', ->

    it 'globally', ->
      withOut.locals = secret: 6 * 7
      expect(do withOut -> i secret).to.equal '<i>42</i>'

      withOut.locals = -> secret: 9 * 3
      expect(do withOut -> i secret).to.equal '<i>27</i>'

      delete withOut.locals

    it 'locally', ->
      t = withOut -> b self
      t.locals = self: 2 * 2
      expect(do t).to.equal '<b>4</b>'

      t = withOut -> s self
      t.locals = self: 4 * 27
      expect(do t).to.equal '<s>108</s>'

  it 'check their names', ->
    t = withOut ->
    z = (name)->
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

  it 'can be tags', ->
    t = withOut ->
      oops time
    t.locals =
      oops: '<>'
      time: 'again'
    expect(do t).to.equal '<oops>again</oops>'

    t = withOut ->
      oops when: time
    t.locals =
      oops: '</>'
      time: 'again'
    expect(do t).to.equal '<oops when="again">'

  it 'bind lazily', ->
    t = withOut ->
      u value

    withOut.locals = value: 1
    expect(do t).to.equal res = '<u>1</u>'

    withOut.locals = value: 2
    expect(do t).to.equal res

    delete withOut.locals
