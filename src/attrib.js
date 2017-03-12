// Output attribute(s)
function attributes(prefix, obj)
{
  var v, me = ''
  for(var k in obj)
    if('object' == typeof(v = obj[k]))
      me += attributes(prefix + k + '-', v)
    else if(null != v && false !== v)
    {
      me += prefix + h(k)
      if(true !== v)
        me += '="' + h(v) + '"'
    }
  return me
}
