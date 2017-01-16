// User-generated tag
var emptyTags = {}

function adhocTag()
{
  return Tag

  function Tag(name, empty) { return tag(name, empty) }

  function tag(name, empty)
  {
    if(null == empty)
    {
      makeScope()
      empty = emptyTags[('' + name).toLowerCase()]
    }
    return makeTag(name, empty)
  }
}
