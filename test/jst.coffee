expect = require 'expect.js'
withOut= require '..'

JST={}
do -> @JST=JST

JST['t/1']=(data)->
  ul -> li @X, '=', data.X

JST['t/2']=->
  div id: 2, @Y

JST['t/3']=1

JST['t/4']=(self,data)->
  ul ->
    li @X
    li data.X

describe 'JST', ->

  it 'produces function templates', ->
    expect(withOut.JSTs 't/1').to.be.a('function')
    expect(withOut.JSTs 't/3').to.be.a('function')
    expect(withOut.JSTs 't/none').to.be.a('function')

  it 'templates can be used again', ->
    expect(do (t=withOut.JSTs 't/1')-> t(X: 42)==t(X: 40+2)).to.
      equal(true)

  it 'uses both call styles', ->
    expect(withOut.JSTs('t/1') X: 'self').to.
    equal '<ul><li>self=self</li></ul>'

  it 'uses multiple data', ->
    expect(withOut.JSTs('t/4') {X: 'One'}, X: 'Two').to.
      equal '<ul><li>One</li><li>Two</li></ul>'

  it 'merges templates', ->
    expect(withOut.JSTs('t/1', 't/2') X: 'self', Y: 'other').to.
      equal '<ul><li>self=self</li></ul><div id="2">other</div>'

  it 'throws error on incorrect templates', ->
    expect(withOut.JSTs 't/3').to.throwError()
    expect(withOut.JSTs 't/none').to.throwError()

  it 'can get JSTs in arrays', ->
    expect(withOut.JSTs(['t/1', 't/2']) X: 'self', Y: 'other').to.
      equal '<ul><li>self=self</li></ul><div id="2">other</div>'

    expect(withOut.JSTs(['t/1', [], [['t/2']]]) X: 'self', Y: 'other').to.
      equal '<ul><li>self=self</li></ul><div id="2">other</div>'

  it 'can get JSTs in object values', ->
    expect(withOut.JSTs(one: 't/1', two: 't/2') X: 'self', Y: 'other').to.
      equal '<ul><li>self=self</li></ul><div id="2">other</div>'

    expect(withOut.JSTs(one: ['t/1', []], two: two: 't/2') X: 'self', Y: 'other').to.
      equal '<ul><li>self=self</li></ul><div id="2">other</div>'

  it 'even works as $compile', ->
    expect(do withOut.JSTs(-> div class: 'none')).to.
      equal '<div class="none"></div>'

    expect(withOut.JSTs(-> span class: @class) class: 'label').to.
      equal '<span class="label"></span>'
