// Output text & inner tags
function children(a)
{
  var e, len = a.length, prev
  prev = html
  html = ''
  try
  {
    for(var i = 0; i < len; i++)
    {
      if(null == (e = a[i])) continue;
      if('function' == typeof e)
        e.call(_this)
      else
        html += h(e)
    }
  }
  finally
  {
    html = prev + html
  }
}
