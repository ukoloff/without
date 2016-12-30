// Lazy compilation of template
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

  // Template rendering function
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

  // Build name for template
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

  // Compile template
  function build()
  {
    var name
    build = function() {}
    fn = fn.toString()
    minified = !/[\r\n]/.test(fn)
    makeScope()
    fn = makeVars() + '\nreturn ' + fn
    if(!minified)
      fn += '\n//# sourceURL=eval://withOut/' + (name = getName()) + '.wo'
    fn = (new Function(fn)).call(scope)
    if(!minified)
    {
      fn.displayName = '<' + name + '>'
      wrapper.displayName = '{{' + name + '}}'
    }
  }

  // Check whether template should be step in (breakpoint)
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
