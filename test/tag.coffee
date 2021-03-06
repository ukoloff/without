expect = require 'expect.js'
withOut= require '..'

describe 'tag', ->
  it 'render', ->
    expect(withOut.compile(-> div())()).to.equal '<div></div>'

  it 'render attributes', ->
    expect(withOut.compile(-> div id: 'A')()).to.equal '<div id="A"></div>'
    expect(withOut.compile(-> div id: null)()).to.equal '<div></div>'

  it 'render text content', ->
    expect(withOut.compile(-> div 'Hi there!')()).to.equal '<div>Hi there!</div>'

  it 'render children', ->
    expect(withOut.compile(-> div -> span 'Ok')()).to.equal '<div><span>Ok</span></div>'
