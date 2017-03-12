// Build tag rendering function
function makeTag(name, empty)
{
  return Tag

  function Tag() { tag(arguments) }

  // Output full tag
  function tag(a)
  {
    var at = a[0]
    if('object' == typeof at)
    {
      at = attributes(' ', at)
      a = cdr(a)
    }
    else
      at = ''
    html += '<' + name + at + '>'
    if(empty && a.length)
      throw SyntaxError("<" + name + "> must have no content!")
    if(empty)
      return
    children(a)
    html += "</" + name + ">"
  }
}
