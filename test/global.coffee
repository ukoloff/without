expect = require 'expect.js'
withOut= require '..'

describe 'Invalid tags', ->
  it 'are errors', ->
    expect(withOut -> oops true).to.throwError()
