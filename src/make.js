// Build tag rendering function
function makeTag(name, empty)
{
  return function() { tag(arguments) }

  // Output single attribute
  function attr(k, v)
  {
    if(null == v || false === v) return
    html += ' ' + h(k)
    if(true !== v)
      html += '="' + h(v) + '"'
  }

  // Output data-* attribute(s)
  function nest(prefix, obj)
  {
    for(var k in obj)
      if('object' == typeof obj[k])
        nest(prefix + k + '-', obj[k])
      else
        attr(prefix + k, obj[k])
  }

  // Output full tag
  function tag(a)
  {
    html += '<' + name
    var at = a[0]
    if('object' == typeof at)
    {
     for(var k in at)
       if('data' == k && 'object' == typeof at[k])
         nest('data-', at[k])
       else
         attr(k, at[k])
     a = shift(a)
    }
    html += '>'
    if(empty && a.length)
      throw SyntaxError("<" + name + "> must have no content!")
    if(empty)
      return
    children(a)
    html += "</" + name + ">"
  }
}
