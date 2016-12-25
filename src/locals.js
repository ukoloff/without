function filterLocals(locals)
{
  if('function' == typeof locals)
    locals = locals()
  if('object' != typeof locals)
    return
  var res
  for(var k in locals)
  {
    if(!/^[$\w]+$/.test(k))
      throw SyntaxError("Invalid identifier: " + k)
    if(!res)
        res = {}
    var v = locals[k]
    res[k] = 'string'==typeof v && /^<(\/?)>$/.test(v) ?
      makeTag(k, !!RegExp.$1)
      :
      v
  }
  return res
}
