// Lazy compilation of template
var
  names = 0,
  html,
  _this

function renderable(fn, template, n)
{
  if('function' != typeof fn)
    throw TypeError("Call: withOut(function)")
  var minified
  template.id = null

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
    var name = template.id
    if(null == name)
      name = ''
    name = String(name).split(/\W+/).join('/').replace(/^\/+|\/+$/g, '')
    if(!name.length)
      name = ++names
    template.id = name
    if(n)
      name += '[' + n + ']'
    return name
  }

  // Compile template
  function build()
  {
    var name, code = fn.toString()
    minified = !/[\r\n]/.test(code)
    makeScope()
    var myScope = merge(scope, filterLocals(withOut.$), filterLocals(template.$))
    code = makeVars(myScope) + '\nreturn ' + code
    if(!minified)
      code += '\n//# sourceURL=eval://withOut/' + (name = getName()) + '.wo'
    fn = (new Function(code)).call(myScope)
    build = function() {}
    if(minified)
      return
    fn.displayName = '<' + name + '>'
    template.displayName = '{{' + name + '}}'
  }

  // Check whether template should be step in (breakpoint)
  function bp()
  {
    if(minified || false === $compile.bp)
      return
    if($compile.bp)
      return true
    if(n && 'number' == typeof template.bp)
      return n == template.bp
    return template.bp
  }
}
