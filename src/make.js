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
       if('data' == k && 'object' == typeof at[k])
         nest('data-', at[k])
       else
         attr(k, at[k])
     a = shift(a)
    }
    html += me + '>'
    if(empty && a.length)
      throw SyntaxError("<" + name + "> must have no content!")
    if(empty)
      return
    children(a)
    html += "</" + name + ">"

    // Output single attribute
    function attr(k, v)
    {
      if(null == v || false === v) return
      me += ' ' + h(k)
      if(true !== v)
        me += '="' + h(v) + '"'
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
  }
}
