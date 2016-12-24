var
  names = 0,
  html,
  _this

function renderable(fn, wrapper, n)
{
  if('function' != typeof fn)
    throw TypeError("Call: withOut(function)")
  var minified
  wrapper.id = null

  return render

  function render()
  {
    build()
    try
    {
      var that = _this, x = html
      _this = this
      html = ''
      if(bp())
        debugger // Hit `Step Into` (F11) twice
      fn.apply(this, arguments)
      return html
    }
    finally
    {
      _this = that
      html = x
    }
  }

  function getName()
  {
    var name = wrapper.id
    if(null == name)
      name = ''
    name = String(name).split(/\W+/).join('/').replace(/^\/+|\/+$/g, '')
    if(!name.length)
      name = ++names
    wrapper.id = name
    if(n)
      name += '[' + n + ']'
    return name
  }

  function build()
  {
    var name, code = fn.toString()
    minified = !/[\r\n]/.test(code)
    makeScope()
    var myScope = merge(scope, filterLocals($compile.locals), filterLocals(wrapper.locals))
    code = makeVars(myScope) + '\nreturn ' + code
    if(!minified)
      code += '\n//# sourceURL=eval://withOut/' + (name = getName()) + '.wo'
    fn = (new Function(code)).call(myScope)
    build = function() {}
    if(minified)
      return
    fn.displayName = '<' + name + '>'
    wrapper.displayName = '{{' + name + '}}'
  }

  function bp()
  {
    if(minified || false === $compile.bp)
      return
    if($compile.bp)
      return true
    if(n && 'number' == typeof wrapper.bp)
      return n == wrapper.bp
    return wrapper.bp
  }
}
