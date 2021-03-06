expect = require 'expect.js'
withOut= require '..'

describe 'HTML attributes', ->
  it 'can be omitted', ->
    expect(withOut.compile(-> span ->).call 0).to.equal '<span></span>'

  it 'can be included', ->
    expect(withOut.compile(-> h1 id: 1).call 0).to.equal '<h1 id="1"></h1>'
    expect(withOut.compile(-> h2 id: 1, class: @x).call x: 2).to.equal '<h2 id="1" class="2"></h2>'

  it 'ignore null values', ->
    expect(withOut.compile(-> h3 id: @id, class: null).call id: null).to.equal '<h3></h3>'
    expect(withOut.compile(-> h4 id: @id, class: {}.class).call ids: [1]).to.equal '<h4></h4>'

  it 'ignore false values', ->
    expect(withOut.compile(-> option selected: false, 'Me').call 0).to.equal '<option>Me</option>'
    expect(withOut.compile(-> input type: @type, checked: @checked).call type: 'checkbox', checked: false).to.
      equal '<input type="checkbox">'

  it 'respect true values', ->
    expect(withOut.compile(-> input type: 'radio', name: @name, value: @value, checked: @checked).
      call name: 'city', value: 'Ankh-Morpork', checked: true).to.
      equal '<input type="radio" name="city" value="Ankh-Morpork" checked>'

  it 'escape values', ->
    expect(withOut.compile(-> h5 id: @id).call id: 'a&b').to.equal '<h5 id="a&amp;b"></h5>'

  it 'generate data-* from object', ->
    expect(withOut.compile(-> h6 data: @data).call data: a: 1, b:2, c: true, d: false, e: null, f: {}.f).to.
      equal '<h6 data-a="1" data-b="2" data-c></h6>'

  it 'allow hashes in data-*', ->
    expect(withOut.$compile(-> i data: @) x: 108, y: z: 42, none: false).to.
      equal '<i data-x="108" data-y-z="42"></i>'

  it 'allow hashes for any object as attribute', ->
    expect withOut.$compile(-> s datum: @) p: 1, q: 2, r: 3
    .to.equal '<s datum-p="1" datum-q="2" datum-r="3"></s>'

  it 'accept numbers', ->
    expect withOut.$compile(-> div id: @id) id: 5
    .to.equal '<div id="5"></div>'

  it 'accept strings', ->
    expect(withOut.$compile(-> div id: @id) id: 'A').to.equal '<div id="A"></div>'

  it 'accept empty strings', ->
    expect(withOut.$compile(-> div title: @title) title: '').to.equal '<div title=""></div>'
