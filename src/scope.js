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

  for(var i = nTags.length - 1; i >= 0; i--)
    scope[nTags[i]] = makeTag(nTags[i])
  for(var i = eTags.length - 1; i >= 0; i--)
    scope[eTags[i]] = makeTag(eTags[i], true)
}
