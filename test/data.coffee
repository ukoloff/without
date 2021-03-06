expect = require 'expect.js'
withOut= require '..'

describe 'data', ->
  it 'renders', ->
    expect(withOut.compile(-> $var @msg).call msg: 'without').to.equal '<var>without</var>'
    expect(withOut.compile((data)-> i data.msg) msg: 'with').to.equal '<i>with</i>'
    expect(withOut.compile(({txt})-> s txt) txt: 'both').to.equal '<s>both</s>'

  it 'renders in children', ->
    expect(withOut.compile(-> div -> $var @msg).call msg: 'without').to.equal '<div><var>without</var></div>'
    expect(withOut.compile((data)-> p -> i data.msg) msg: 'with').to.equal '<p><i>with</i></p>'
    expect(withOut.compile(({txt})-> button -> s txt) txt: 'both').to.equal '<button><s>both</s></button>'
