// Compile JST template(s)
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

  // Render sub-templates and join result(s)
  function JSTs()
  {
    var S = ''
    fetchJSTs()
    for(var i = 0, len = Ts.length; i < len; i++)
      S += Ts[i].apply(this, arguments)
    return S
  }

  // Feed sub-templates to compiler
  function fetchJSTs()
  {
    var v, id = template.id
    for(var i = Ts.length - 1; i >= 0; i--)
    {
      if('function' != typeof(v = Ts[i]) &&
         'function' != typeof(v = JST[v]))
        throw Error("JST['" + Ts[i] + "'] not found or incorrect!")
      Ts[i] = renderable(v, template, i + 1)
    }
    template.id = id
    fetchJSTs = nop
  }
}
