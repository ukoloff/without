expect = require 'expect.js'
withOut= require '..'

describe 'Template', ->
  it 'can render another template', ->
    t1=withOut.$compile -> span id: 'Inner', '(.)'
    t2=withOut.$compile -> div id: 'Outer', -> raw @t1()
    expect(t2 t1: t1).to.
      equal '<div id="Outer"><span id="Inner">(.)</span></div>'

  it 'can pass data to inner template', ->
    t1=withOut.$compile -> span id: 'Inner', @msg
    t2=withOut.$compile (model, t)-> div id: 'Outer', -> raw t @
    expect(t2 msg: '{=}', t1).to.
      equal '<div id="Outer"><span id="Inner">{=}</span></div>'
