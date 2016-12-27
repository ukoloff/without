function JSTs()
{
  return JST$(arguments)
}

function JST$(a)
{
  var Ts = flatten(slice.call(a))
  template.id = null
  return template

  function template(that) { return JSTs.apply(that, arguments) }

  function JSTs()
  {
    var S = ''
    fetchJSTs()
    for(var i in Ts)
      S += Ts[i].apply(this, arguments)
    return S
  }

  function fetchJSTs()
  {
    var v, id = template.id
    for(var i in Ts)
    {
      if('function' != typeof(v = Ts[i]) &&
         'function' != typeof(v = JST[v]))
        throw Error("JST['" + Ts[i] + "'] not found or incorrect!")
      Ts[i] = renderable(v, template, Number(i) + 1)
    }
    template.id = id
    fetchJSTs = function() {}
  }
}
