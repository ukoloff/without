expect = require 'expect.js'
withOut= require '..'

describe 'Locals', ->

  it 'are injected into templates', ->

    withOut.locals = secret: 6*7
    expect(do withOut -> i secret).to.equal '<i>42</i>'
    delete withOut.locals
