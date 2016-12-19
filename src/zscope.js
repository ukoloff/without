var scope = {
  print: function() { print(arguments) },
  raw: function() { raw(arguments) },
  notag: function() { noTag(arguments) },
  coffeescript: function() { coffeeScript(arguments) },
  blackhole: function() {},
  comment: makeComment(),
  tag: adhocTag(),
  $var: makeTag('var')
}

scope.text = scope.print

for(var i in nTags) scope[nTags[i]] = makeTag(nTags[i])
for(var i in eTags) scope[eTags[i]] = makeTag(eTags[i], true)
