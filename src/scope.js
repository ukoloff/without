// Create list of tags available
var scope

function makeScope()
{
  makeScope = nop

  scope = {
    print: text,
    text: text,
    raw: function() { raw(arguments) },
    notag: function() { noTag(arguments) },
    coffeescript: function() { coffeeScript(arguments) },
    blackhole: nop,
    comment: makeComment(),
    tag: adhocTag(),
    $var: makeTag('var')
  }

  var tag, tags

  split(nTags)
  while(tag = tags.pop())
    scope[tag] = makeTag(tag)

  split(eTags)
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
