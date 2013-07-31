expect = require 'expect.js'
withOut= require '..'

describe 'tag', ->
  it 'render', ->
    expect(withOut.renderable(-> div())()).to.equal '<div></div>'

  it 'render attributes', ->
    expect(withOut.renderable(-> div id: 'A')()).to.equal '<div id="A"></div>'
    expect(withOut.renderable(-> div id: null)()).to.equal '<div></div>'

  it 'render text content', ->
    expect(withOut.renderable(-> div 'Hi there!')()).to.equal '<div>Hi there!</div>'

  it 'render children', ->
    expect(withOut.renderable(-> div -> span 'Ok')()).to.equal '<div><span>Ok</span></div>'
