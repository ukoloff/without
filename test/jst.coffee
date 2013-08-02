expect = require 'expect.js'
withOut= require '..'

JST=GLOBAL.JST?={}

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
