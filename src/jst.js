function JSTs(path)
{
  var bound, Ts = flatten(slice.call(arguments))
  wrapper.id = null
  return wrapper

  function wrapper(that) { return JSTs.apply(that, arguments) }

  function JSTs()
  {
    var S = ''
    if(!bound)
      fetchJSTs()
    for(var i in Ts)
      S += Ts[i].apply(this, arguments)
    return S
  }

  function fetchJSTs()
  {
    var v, id = wrapper.id
    for(var i in Ts)
    {
      if('function' != typeof(v=Ts[i]) &&
         'function' != typeof(v=JST[v]))
        throw Error("JST['" + Ts[i] + "'] not found or incorrect!")
      Ts[i] = renderable(v, wrapper, Number(i) + 1)
    }
    wrapper.id = id
    bound = true
  }
}
