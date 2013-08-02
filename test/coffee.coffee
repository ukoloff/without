expect = require 'expect.js'
withOut= require '..'

describe 'coffeescript', ->
  it 'inserts <script>', ->
    expect(withOut.compile(-> coffeescript -> alert "Hi!")().replace /\s+/g, ' ').to.
      equal '<script><!-- (function () { return alert("Hi!"); })() //--> </script>'

  it 'comments script from (very) old browsers', ->
    expect(withOut.compile(-> coffeescript ->) 0).to.
      match /<script><!--\s*\n/
    expect(withOut.compile(-> coffeescript ->) 0).to.
      match /\n\s*\/{2}\s*-->\s*\n\s*<\/script>/

  it 'requires single function inside', ->
    expect(withOut.compile -> coffeescript()).to.
      throwError()
    expect(withOut.compile -> coffeescript 0).to.
      throwError()
    expect(withOut.compile -> coffeescript (->), ->).to.
      throwError()
