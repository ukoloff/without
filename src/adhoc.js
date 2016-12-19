function adhocTag()
{
  return function(name, empty) { return tag(name, empty) }

  function isEmpty(name)
  {
    for(var i in eTags)
      if(name == eTags[i])
        return true
  }

  function tag(name, empty)
  {
    if(null==empty)
      empty = isEmpty(String(name).toLowerCase())
    return makeTag(name, empty)
  }
}
