function merge()
{
  var res, dup, len = arguments.length
  for(var i = 0; i < len; i++)
  {
    var rec = arguments[i]
    if('object' != typeof rec)
      continue
    if(!res)
    {
      res = rec
      continue;
    }
    if(!dup)
    {
      dup = {}
      for(var k in res)
        dup[k] = res[k]
      res = dup
      dup = 1
    }
    for(var k in rec)
      res[k] = rec[k]
  }
  return res
}
