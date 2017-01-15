// Create list of tags available
var scope

function makeScope()
{
  makeScope = function() {}

  scope = {
    print: text,
    text: text,
    raw: function() { raw(arguments) },
    notag: function() { noTag(arguments) },
    coffeescript: function() { coffeeScript(arguments) },
    blackhole: function() {},
    comment: makeComment(),
    tag: adhocTag(),
    $var: makeTag('var')
  }

  var tag, tags

  split(nTags)
  // Allow to garbage collect
  nTags = 0
  while(tag = tags.pop())
    scope[tag] = makeTag(tag)

  split(eTags)
  // Allow to garbage collect too
  eTags = 0
  while(tag = tags.pop())
  {
    scope[tag] = makeTag(tag, 1)
    emptyTags[tag] = 1
  }

  function split(fn)
  {
    tags = fn().split(' ')
  }
}
