//
// without.js v1.2.3: Yet another CoffeScript template (without `with`, coffescript and templates)
// https://github.com/ukoloff/without
//
!function(){
var emptyTags = {}
function adhocTag()
{
  return Tag
  function Tag(name, empty) { return tag(name, empty) }
  function tag(name, empty)
  {
    if(null == empty)
    {
      makeScope()
      empty = emptyTags[('' + name).toLowerCase()]
    }
    return makeTag(name, empty)
  }
}
function attributes(prefix, obj)
{
  var v, me = ''
  for(var k in obj)
    if('object' == typeof(v = obj[k]))
      me += attributes(prefix + k + '-', v)
    else if(null != v && false !== v)
    {
      me += prefix + h(k)
      if(true !== v)
        me += '="' + h(v) + '"'
    }
  return me
}
function children(a)
{
  var e, len = a.length, prev
  prev = html
  html = ''
  try
  {
    for(var i = 0; i < len; i++)
    {
      if(null == (e = a[i])) continue;
      if('function' == typeof e)
        e.call(_this)
      else
        html += h(e)
    }
  }
  finally
  {
    html = prev + html
  }
}
function coffeeScript(a)
{
  if(1 != a.length || 'function' != typeof a[0])
    throw SyntaxError('Usage: coffeescript -> code')
  html += '<script><!--\n(' + a[0] + ')()\n//-->\n</'
  html += 'script>'
}
function makeComment()
{
  var level = 0
  return Comment
  function Comment() { comment(arguments) }
  function comment(a)
  {
    html += level++ ? '<comment level="' + level + '">' : "<!-- "
    children(a)
    html += --level ? '</comment>' : ' -->'
  }
}
function compile()
{
  return withOut
  function withOut(fn)
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
if('object' == typeof module && module.exports)
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
  return ('' + s).replace(/[&<>"]/g, function(e) { return htmlEntities[e] })
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
    fetchJSTs = nop
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
  return Tag
  function Tag() { tag(arguments) }
  function tag(a)
  {
    var at = a[0]
    if('object' == typeof at)
    {
      at = attributes(' ', at)
      a = cdr(a)
    }
    else
      at = ''
    html += '<' + name + at + '>'
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
function nop()
{
}
function noTag(a)
{
  children('object' == typeof a[0] ? cdr(a) : a)
}
function print(a)
{
  var e, len = a.length, me = ''
  for(var i = 0; i < len; i++)
    if(null != (e = a[i]))
      me += h(e)
  html += me
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
    name = ('' + name).split(/\W+/).join('/').replace(/^\/+|\/+$/g, '')
    if(!name.length)
      name = ++names
    template.id = name
    if(n)
      name += '[' + n + ']'
    return name
  }
  function build()
  {
    var name, code = '' + fn
    minified = !/[\r\n]/.test(code)
    makeScope()
    var myScope = merge(scope, filterLocals(withOut.$), filterLocals(template.$))
    code = makeVars(myScope) + '\nreturn ' + code
    if(!minified)
      code += '\n//# sourceURL=eval://withOut/' + (name = getName()) + '.wo'
    fn = (new Function(code)).call(myScope)
    build = nop
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
  makeScope = nop
  scope = {
    print: text,
    text: text,
    raw: function() { raw(arguments) },
    notag: function() { noTag(arguments) },
    coffeescript: function() { coffeeScript(arguments) },
    blackhole: nop,
    comment: makeComment(),
    tag: adhocTag(),
    $var: makeTag('var')
  }
  var tag, tags
  split(nTags)
  while(tag = tags.pop())
    scope[tag] = makeTag(tag)
  split(eTags)
  while(tag = tags.pop())
  {
    scope[tag] = makeTag(tag, 1)
    emptyTags[tag] = 1
  }
  function split(fn)
  {
    tags = fn().split(' ')
  }
}
var slice = [].slice
function cdr(a)
{
  return slice.call(a, 1)
}
function nTags()
{
  nTags = nop
  var s = 'a abbr acronym address applet article aside audio '
  s += 'b bdo big blockquote body button canvas caption center cite code colgroup command '
  s += 'datalist dd del details dfn dir div dl dt em embed '
  s += 'fieldset figcaption figure font footer form frameset '
  s += 'h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd '
  s += 'label legend li map mark menu meter nav noframes noscript '
  s += 'object ol optgroup option output p pre progress q rp rt ruby '
  s += 's samp script section select small source span strike strong style sub summary sup '
  return s + 'table tbody td textarea tfoot th thead time title tr tt u ul video wbr xmp'
}
function eTags()
{
  eTags = nop
  return 'area base basefont br col frame hr img input link meta param'
}
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
