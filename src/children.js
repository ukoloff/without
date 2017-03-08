// Output text & inner tags
function children(a)
{
  var e, len = a.length, prev
  for(var i = 0; i < len; i++)
  {
    if(null == (e = a[i])) continue;
    if('function' == typeof e)
      try
      {
        prev = html
        html = ''
        e.call(_this)
      }
      finally
      {
        html = prev + html
      }
    else
      html += h(e)
  }
}
