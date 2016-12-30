function print(a)
{
  var e, len = a.length
  for(var i = 0; i < len; i++)
    if(null != (e = a[i]))
      html += h(e)
}
