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
