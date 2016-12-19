var scope = {
  print: function() { print(arguments) },
  raw: function() { raw(arguments) },
  tag: adhocTag(),
  notag: function() { noTag.apply(this, arguments) },
  comment: makeComment(),
  blackhole: function() {},
  coffeescript: function() { coffeeScript.apply(this, arguments) },
  $var: makeTag('var')
}

scope.text = scope.print

for(var i in nTags) scope[nTags[i]] = makeTag(nTags[i])
for(var i in eTags) scope[eTags[i]] = makeTag(eTags[i], true)
