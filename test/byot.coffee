expect = require 'expect.js'
withOut= require '..'

describe 'Build Your Own Tag', ->
  it 'creates any tag', ->
    expect(withOut.compile(-> (tag 'www') '...')()).to.equal '<www>...</www>'
    expect(withOut.compile(->
      z=tag 'z'
      z '!')()).to.equal '<z>!</z>'

  it 'creates aliases to tags', ->
    expect(withOut.compile(-> (tag 'div') 'Bingo!', ->  hr size: '80%')()).to.
      equal '<div>Bingo!<hr size="80%"></div>'
    expect(withOut.compile(->
      z=tag 'div'
      z -> hr size: '80%')()).to.equal '<div><hr size="80%"></div>'

  it 'creates empty tags', ->
    expect(withOut.compile(-> (tag 'div', 1) a: 2)()).to.
      equal '<div a="2">'
    expect(withOut.compile(-> (tag 'span', true) id: 'X', '+')).to.
      throwError()

  it 'creates normal tags even for empty tag names', ->
    expect(withOut.compile(-> (tag 'br', 0) class: 'X')()).to.
      equal '<br class="X"></br>'
    expect(withOut.compile(-> (tag 'hr', false) class: 'X', -> br class: 'Y')()).to.
      equal '<hr class="X"><br class="Y"></hr>'

  it 'autodetect tag emptyness', ->
    expect(withOut.compile(-> (tag 'div') class: 'A', -> (tag 'br') class: 'B')()).to.
      equal '<div class="A"><br class="B"></div>'
    expect(withOut.compile(-> (tag 'BR') class: 'UU')()).to.equal '<BR class="UU">'
    expect(withOut.compile(-> (tag 'Br') class: 'UL')()).to.equal '<Br class="UL">'
    expect(withOut.compile(-> (tag 'bR') class: 'LU')()).to.equal '<bR class="LU">'
    expect(withOut.compile(-> (tag 'br') class: 'LL')()).to.equal '<br class="LL">'
