expect = require 'expect.js'
withOut= require '..'

describe 'comment', ->
  it 'adds <!-- ... -->', ->
    expect(withOut.$compile(-> comment @msg) msg: 'Oops!').to.
      equal '<!-- Oops! -->'

  it 'can have chilren', ->
    expect(withOut.$compile(-> comment -> b @msg) msg: 'Oops!').to.
      equal '<!-- <b>Oops!</b> -->'

  it 'can nest', ->
    expect(withOut.$compile(-> comment -> div -> comment -> p @msg) msg: 'Oops!').to.
      equal '<!-- <div><comment level="2"><p>Oops!</p></comment></div> -->'
