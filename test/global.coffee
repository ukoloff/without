expect = require 'expect.js'
withOut= require '..'

describe 'Invalid tags', ->
  it 'are errors', ->
    expect(withOut -> oops true).to.throwError()

describe 'Global tags', ->
  it 'can be created', ->
    withOut.tag 'hi'
    expect(do withOut -> hi 'there').to.equal '<hi>there</hi>'
    withOut.tag 'hello', true
    expect(do withOut -> hello class: false).to.equal '<hello>'

  it 'validate name', ->
    expect(-> withOut.tag 'a+b').to.throwError (e)->
      expect(e).to.be.a SyntaxError

  it 'use lazy compilation', ->
    t = withOut -> none id: @
    withOut.tag 'none', true
    expect(t 0).to.equal '<none id="0">'

  it 'can be destroyed', ->
    withOut.tag 'oops'
    expect(do withOut -> oops 'again').to.equal '<oops>again</oops>'
    withOut.tag 'oops', '#'
    expect(withOut -> oops '?').to.throwError()
