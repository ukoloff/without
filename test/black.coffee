expect = require 'expect.js'
withOut= require '..'

describe 'Black hole', ->
  it 'drops its conents', ->
    expect(withOut.compile(->div -> blackhole 'A') 0).to.equal '<div></div>'
    expect(withOut.compile(->span 'A', -> blackhole -> div 'B') 0).to.equal '<span>A</span>'

  it 'drops it attrs', ->
    expect(withOut.compile(->td -> blackhole id: 'X', br()) 0).to.equal '<td><br></td>'
