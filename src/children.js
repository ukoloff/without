function children(a)
{
  var i, e
  for(i=0; i<a.length; i++)
  {
    if(null==(e=a[i])) continue;
    if('function'==typeof e)
      e.call(_this)
    else
      html+=h(e)
  }
}
