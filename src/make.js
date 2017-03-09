// Build tag rendering function
function makeTag(name, empty)
{
  return Tag

  function Tag() { tag(arguments) }

  // Output full tag
  function tag(a)
  {
    var me = '<' + name
    var at = a[0]
    if('object' == typeof at)
    {
     for(var k in at)
       me += 'data' == k && 'object' == typeof at[k] ?
         nestAttr('data-', at[k])
         :
         attribute(k, at[k])
     a = cdr(a)
    }
    html += me + '>'
    if(empty && a.length)
      throw SyntaxError("<" + name + "> must have no content!")
    if(empty)
      return
    children(a)
    html += "</" + name + ">"
  }
}
