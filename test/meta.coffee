expect = require 'expect.js'
withOut= require '..'

describe 'Engine', ->
  it 'exports functions', ->
    expect(withOut.compile).to.be.a('function')
    expect(withOut.$compile).to.be.a('function')
    expect(withOut.renderable).to.be.a('function')

  it 'accept functions', ->
    expect(withOut ->).to.be.a('function')
    expect(withOut.compile ->).to.be.a('function')
    expect(withOut.$compile ->).to.be.a('function')
    expect(withOut.renderable ->).to.be.a('function')

  it 'accept nothing but functions', ->
    expect(-> withOut 1).to.throwError()
    expect(-> withOut.compile 1).to.throwError()
    expect(-> withOut.$compile 1).to.throwError()
    expect(-> withOut.renderable 1).to.throwError()

  it 'is function itself', ->
    expect(withOut).to.be.equal withOut.$compile
    expect(withOut).not.to.be.equal withOut.compile
