// Output text
function print(a)
{
  var e, len = a.length, me = ''
  for(var i = 0; i < len; i++)
    if(null != (e = a[i]))
      me += h(e)
  html += me
}
