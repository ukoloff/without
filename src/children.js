// Output text & inner tags
function children(a)
{
  var e, len = a.length, prev
  for(var i = 0; i < len; i++)
    try
    {
      prev = html
      html = ''
      if(null == (e = a[i])) continue;
      if('function' == typeof e)
        e.call(_this)
      else
        html = h(e)
    }
    finally
    {
      html = prev + html
    }
}
