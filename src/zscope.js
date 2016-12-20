var scope = {
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

for(var i in nTags) scope[nTags[i]] = makeTag(nTags[i])
for(var i in eTags) scope[eTags[i]] = makeTag(eTags[i], true)
