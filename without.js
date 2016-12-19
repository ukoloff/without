//
// without.js v1.1.2: Yet another CoffeScript template (without `with`, coffescript and templates)
// https://github.com/ukoloff/without
//
!function(){

function adhocTag()
{
  return function(name, empty) { return tag(name, empty) }

  function isEmpty(name)
  {
    for(var i in eTags)
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
  var i, e
  for(i = 0; i < a.length; i++)
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
    html += level++? '<comment level="' + level + '">' : "<!-- "
    children(a)
    html += --level? '</comment>' : ' -->'
  }
}

function compile(fn)
{
  var withOut = renderable(fn, wrapper)
  return wrapper

  function wrapper() { return withOut.apply(this, arguments) }
}

if('undefined' != typeof module && module.exports)
  module.exports = $compile
else if('function' == typeof define && define.amd)
  define(function() { return $compile })
else
  this.withOut = $compile

$compile.$compile = $compile
$compile.compile = compile
$compile.renderable = compile
$compile.JSTs = JSTs

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

function $compile(fn)
{
  var withOut = renderable(fn, wrapper)
  return wrapper

  function wrapper(that) { return withOut.apply(that, arguments) }
}

function makeTag(name, empty)
{
  return function() { tag(arguments) }

  function attr(k, v)
  {
    if(null==v || false===v) return
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
    if('object'==typeof at)
    {
     for(var k in at)
       if('data'==k && 'object'==typeof at[k])
         nest('data-', at[k])
       else
         attr(k, at[k])
     a = slice.call(a, 1)
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

function noTag(a)
{
  children('object' == typeof a[0] ? slice.call(a, 1) : a)
}

function print(a)
{
  var i, e
  for(i = 0; i < a.length; i++)
    if(null != (e = a[i]))
      html += h(e)
}

function raw(a)
{
  var i, e
  for(i = 0; i < a.length; i++)
    if(null != (e = a[i]))
      html += e
}

var
  names = 0,
  html = '',
  _this

function renderable(fn, wrapper, n)
{
  if('function' != typeof fn)
    throw TypeError("Call: withOut.compile(function)")
  var pending = true, minified
  wrapper.id = null

  return render

  function render()
  {
    if(pending)
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
    var name
    fn = fn.toString()
    minified = !/[\r\n]/.test(fn)
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

  function bp()
  {
    if(minified || false===$compile.bp)
      return
    if($compile.bp)
      return true
    if(n && 'number'==typeof wrapper.bp)
      return n == wrapper.bp
    return wrapper.bp
  }
}

var slice = [].slice

var nTags='a abbr acronym address applet article aside audio b bdo big blockquote body button \
canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt \
em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html \
i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object \
ol optgroup option output p pre progress q rp rt ruby \
s samp script section select small source span strike strong style sub summary sup \
table tbody td textarea tfoot th thead time title tr tt u ul video wbr xmp'.split(' ')

var eTags='area base basefont br col frame hr img input link meta param'.split(' ')

function makeVars()
{
  var v = []
  for(var tag in scope)
    v.push(tag + '=this.' + tag)
  return 'var ' + v.join(',')
}

var scope = {
  print: function() { print(arguments) },
  raw: function() { raw(arguments) },
  tag: adhocTag(),
  notag: function() { noTag(arguments) },
  comment: makeComment(),
  blackhole: function() {},
  coffeescript: function() { coffeeScript(arguments) },
  $var: makeTag('var')
}

scope.text = scope.print

for(var i in nTags) scope[nTags[i]] = makeTag(nTags[i])
for(var i in eTags) scope[eTags[i]] = makeTag(eTags[i], true)

}()
//--[EOF]------------------------------------------------------------
