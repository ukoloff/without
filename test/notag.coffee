expect = require 'expect.js'
withOut= require '..'

describe 'notag', ->

  it 'renders text', ->
    expect(withOut.$compile(-> notag @msg, ', there!') msg: 'Hi').to.equal 'Hi, there!'

  it 'renders nested tags', ->
    expect(withOut(-> notag 'This is ', -> b @place, '!!!') place: 'Sparta').to.equal 'This is <b>Sparta!!!</b>'

  it 'ignores attributes', ->
    expect(withOut.compile(-> notag id: 'None', -> ol -> li '...')()).to.equal '<ol><li>...</li></ol>'

  it 'used to conditionally exclude tags', ->
    t=withOut.$compile -> td -> (if @id then a else notag) href: '/user/'+@id, @name
    expect(t id: 1, name: 'John').to.equal '<td><a href="/user/1">John</a></td>'
    expect(t name: 'None').to.equal '<td>None</td>'


