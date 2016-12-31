//
// without.js v1.2.0: Yet another CoffeScript template (without `with`, coffescript and templates)
// https://github.com/ukoloff/without
//
!function(){
function adhocTag()
{
  return function(name, empty) { return tag(name, empty) }
  function isEmpty(name)
  {
    for(var i = eTags.length - 1; i >= 0; i--)
      if(name == eTags[i])
        return true
  }
  function tag(name, empty)
  {
    if(null==empty)
      empty = isEmpty(String(name).toLowerCase())
    return makeTag(name, empty)
  }
}
function children(a)
{
  var e, len = a.length
  for(var i = 0; i < len; i++)
  {
    if(null == (e = a[i])) continue;
    if('function' == typeof e)
      e.call(_this)
    else
      html += h(e)
  }
}
function coffeeScript(a)
{
  if(1 != a.length || 'function' != typeof a[0])
    throw SyntaxError('Usage: coffeescript -> code')
  html += '<script><!--\n(' + a[0].toString() + ')()\n//-->\n</script>';
}
function makeComment()
{
  var level = 0
  return function() { comment(arguments) }
  function comment(a)
  {
    html += level++ ? '<comment level="' + level + '">' : "<!-- "
    children(a)
    html += --level ? '</comment>' : ' -->'
  }
}
function compile()
{
  return function withOut(fn)
  {
    return compile(fn)
  }
  function compile(fn)
  {
    var withOut = renderable(fn, template)
    return template
    function template() { return withOut.apply(this, arguments) }
  }
}
if('undefined' != typeof module && module.exports)
  module.exports = withOut
else if('function' == typeof define && define.amd)
  define(function() { return withOut })
else
  this.withOut = withOut
withOut.$compile = withOut
withOut.compile =
withOut.renderable = compile()
withOut.JSTs = JSTs
function flatten(array)
{
  var v, r = []
  for(var i in array)
    if('object' == typeof(v = array[i]))
      r.push.apply(r, flatten(v))
    else
      r.push(v)
  return r
}
var htmlEntities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}
function h(s)
{
  return String(s).replace(/[&<>"]/g, function(e) { return htmlEntities[e] })
}
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
    for(var i = 0, len = Ts.length; i < len; i++)
      S += Ts[i].apply(this, arguments)
    return S
  }
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
    fetchJSTs = function() {}
  }
}
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
function withOut(fn)
{
  return $compile(fn)
}
function $compile(fn)
{
  var withOut = renderable(fn, template)
  return template
  function template(that) { return withOut.apply(that, arguments) }
}
function makeTag(name, empty)
{
  return function() { tag(arguments) }
  function attr(k, v)
  {
    if(null == v || false === v) return
    html += ' ' + h(k)
    if(true !== v)
      html += '="' + h(v) + '"'
  }
  function nest(prefix, obj)
  {
    for(var k in obj)
      if('object' == typeof obj[k])
        nest(prefix + k + '-', obj[k])
      else
        attr(prefix + k, obj[k])
  }
  function tag(a)
  {
    html += '<' + name
    var at = a[0]
    if('object' == typeof at)
    {
     for(var k in at)
       if('data' == k && 'object' == typeof at[k])
         nest('data-', at[k])
       else
         attr(k, at[k])
     a = shift(a)
    }
    html += '>'
    if(empty && a.length)
      throw SyntaxError("<" + name + "> must have no content!")
    if(empty)
      return
    children(a)
    html += "</" + name + ">"
  }
}
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
function noTag(a)
{
  children('object' == typeof a[0] ? shift(a) : a)
}
function print(a)
{
  var e, len = a.length
  for(var i = 0; i < len; i++)
    if(null != (e = a[i]))
      html += h(e)
}
function raw(a)
{
  var e, len = a.length
  for(var i = 0; i < len; i++)
    if(null != (e = a[i]))
      html += e
}
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
  function bp()
  {
    if(minified || false === withOut.bp)
      return
    if(withOut.bp)
      return true
    if(n && 'number' == typeof template.bp)
      return n == template.bp
    return template.bp
  }
}
var scope
function makeScope()
{
  makeScope = function() {}
  scope = {
    print: text,
    text: text,
    raw: function() { raw(arguments) },
    notag: function() { noTag(arguments) },
    coffeescript: function() { coffeeScript(arguments) },
    blackhole: function() {},
    comment: makeComment(),
    tag: adhocTag(),
    $var: makeTag('var')
  }
  for(var i = nTags.length - 1; i >= 0; i--)
    scope[nTags[i]] = makeTag(nTags[i])
  for(var i = eTags.length - 1; i >= 0; i--)
    scope[eTags[i]] = makeTag(eTags[i], true)
}
var slice = [].slice
function shift(a)
{
  return slice.call(a, 1)
}
function split(s)
{
  return s.split(' ')
}
var nTags = split('a abbr acronym address applet article aside audio ' +
  'b bdo big blockquote body button canvas caption center cite code colgroup command ' +
  'datalist dd del details dfn dir div dl dt em embed ' +
  'fieldset figcaption figure font footer form frameset ' +
  'h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd ' +
  'label legend li map mark menu meter nav noframes noscript ' +
  'object ol optgroup option output p pre progress q rp rt ruby ' +
  's samp script section select small source span strike strong style sub summary sup ' +
  'table tbody td textarea tfoot th thead time title tr tt u ul video wbr xmp')
var eTags = split('area base basefont br col frame hr img input link meta param')
function text()
{
  print(arguments)
}
function makeVars(scope)
{
  var v = []
  for(var tag in scope)
    v.push(tag + '=this.' + tag)
  return 'var ' + v.join(',')
}
}();
