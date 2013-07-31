expect = require 'expect.js'
withOut= require '..'

describe 'data', ->
  it 'renders', ->
    expect(withOut.renderable(-> $var @msg).call msg: 'without').to.equal '<var>without</var>'
    expect(withOut.renderable((data)-> i data.msg) msg: 'with').to.equal '<i>with</i>'
    expect(withOut.renderable(({txt})-> s txt) txt: 'both').to.equal '<s>both</s>'

  it 'renders in children', ->
    expect(withOut.renderable(-> div -> $var @msg).call msg: 'without').to.equal '<div><var>without</var></div>'
    expect(withOut.renderable((data)-> p -> i data.msg) msg: 'with').to.equal '<p><i>with</i></p>'
    expect(withOut.renderable(({txt})-> button -> s txt) txt: 'both').to.equal '<button><s>both</s></button>'
