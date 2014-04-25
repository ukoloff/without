//
// without.js - CoffeScript template engine with lexical scoping
//

(function()
{
  var
    nTags='a abbr acronym address applet article aside audio b bdo big blockquote body button \
canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt \
em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html \
i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object \
ol optgroup option output p pre progress q rp rt ruby \
s samp script section select small source span strike strong style sub summary sup \
table tbody td textarea tfoot th thead time title tr tt u ul video wbr xmp'.split(' '),
    eTags='area base basefont br col frame hr img input link meta param'.split(' '),
    htmlEntities={'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'},
    slice=[].slice,
    scope={},
    names=0,
    html='',
    _this

  function h(s)
  {
    return String(s).replace(/[&<>"]/g, function(e){return htmlEntities[e]})
  }

  function children(a)
  {
    var i, e
    for(i=0; i<a.length; i++)
    {
      if(null==(e=a[i])) continue;
      if('function'==typeof e)
        e.call(_this)
      else
        html+=h(e)
    }
  }

  function print(a)
  {
    var i, e
    for(i=0; i<a.length; i++) if(null!=(e=a[i])) html+=h(e)
  }

  function raw(a)
  {
    var i, e
    for(i=0; i<a.length; i++) if(null!=(e=a[i])) html+=e
  }

  function makeTag(name, empty)
  {
    return function(){tag(arguments)}
    function attr(k, v)
    {
      if(null==v || false===v) return
      html+=' '+h(k)
      if(true!==v) html+='="'+h(v)+'"'
    }
    function nest(prefix, obj)
    {
      for(var k in obj)
        if('object'==typeof obj[k])
          nest(prefix+k+'-', obj[k])
        else
          attr(prefix+k, obj[k])
    }
    function tag(a)
    {
      html+='<'+name
      var at=a[0]
      if('object'==typeof at)
      {
       for(var k in at)
         if('data'==k && 'object'==typeof at[k])
           nest('data-', at[k])
         else
           attr(k, at[k])
       a=slice.call(a, 1)
      }
      html+='>'
      if(empty && a.length) throw new SyntaxError("<"+name+"> must have no content!")
      if(empty) return
      children(a)
      html+="</"+name+">"
    }
  }

  function makeComment()
  {
    var level=0;
    return function(){ comment.apply(this, arguments) }
    function comment()
    {
      html+= level++? '<comment level="'+level+'">' : "<!-- "
      children(arguments)
      html+= --level? '</comment>': ' -->'
    }
  }

  function coffeeScript()
  {
    if(1!=arguments.length ||'function'!=typeof arguments[0])
      throw new SyntaxError('Usage: coffeescript -> code')
    html+='<script><!--\n('+arguments[0].toString()+')()\n//-->\n</script>';
  }

  function adhocTag()
  {
    return function(name, empty){ return tag(name, empty) }
    function isEmpty(name)
    {
      for(var i in eTags) if(name==eTags[i]) return true
    }
    function tag(name, empty)
    {
      return makeTag(name, null==empty? isEmpty(String(name).toLowerCase()) : empty)
    }
  }

  function noTag(attrs)
  {
    children('object'==typeof attrs ? slice.call(arguments, 1) : arguments)
  }

  scope.print=scope.text=function(){print(arguments)}
  scope.raw=function(){raw(arguments)}
  scope.tag=adhocTag()
  scope.notag=function(){noTag.apply(this, arguments)}
  scope.comment=makeComment()
  scope.blackhole=function(){}
  scope.coffeescript=function(){ coffeeScript.apply(this, arguments) }

  for(var i in nTags) scope[nTags[i]]=makeTag(nTags[i])
  scope.$var=makeTag('var')
  for(var i in eTags) scope[eTags[i]]=makeTag(eTags[i], true)

  function makeVars()
  {
    var v=[];
    for(var tag in scope) v.push(tag+'=this.'+tag)
    return 'var '+v.join(',')
  }

  function renderable(fn, wrapper, n)
  {
    if('function'!=typeof fn)
      throw new TypeError("Call: withOut.compile(function)")
    var pending=true, minified
    wrapper.id=null
    return render

    function render()
    {
      if(pending) build()
      try
      {
        var that=_this, x=html
        _this=this
        html=''
        if(bp())
          debugger // Hit `Step Into` (F11) twice
        fn.apply(this, arguments)
        return html
      }
      finally
      {
        _this=that
        html=x
      }
    }

    function getName()
    {
      var name = wrapper.id
      if(null==name) name=''
      name=String(name).split(/\W+/).join('/').replace(/^\/+|\/+$/g, '')
      if(!name.length)name=++names
      wrapper.id=name
      if(n)
        name+='['+n+']'
      return name
    }

    function build()
    {
      var name
      fn=fn.toString()
      minified = !/[\r\n]/.test(fn)
      fn=makeVars()+'\nreturn '+fn
      if(!minified)
        fn+='\n//# sourceURL=x://withOut/'+(name=getName())+'.wo'
      fn=(new Function(fn)).call(scope)
      if(!minified)
        fn.displayName='{{'+name+'}}'
    }

    function bp()
    {
      if(minified || false===interface.bp) return
      if(interface.bp) return true
      if(n && 'number'==typeof wrapper.bp)
        return n==wrapper.bp
      return !!wrapper.bp
    }
  }

  function compile(fn)
  {
    var withOut=renderable(fn, wrapper)
    return wrapper

    function wrapper(){return withOut.apply(this, arguments)}
  }

  function $compile(fn)
  {
    var withOut=renderable(fn, wrapper)
    return wrapper

    function wrapper(that){return withOut.apply(that, arguments)}
  }

  function flatten(array)
  {
    var v, r=[]
    for(var i in array)
      if('object'==typeof(v=array[i]))
        r.push.apply(r, flatten(v))
      else
        r.push(v)
    return r
  }

  function JSTs(path)
  {
    var bound, Ts=flatten(slice.call(arguments))
    wrapper.id=null
    return wrapper

    function wrapper(that){return JSTs.apply(that, arguments)}

    function JSTs()
    {
      var S=''
      if(!bound) fetchJSTs()
      for(var i in Ts) S+=Ts[i].apply(this, arguments)
      return S
    }

    function fetchJSTs()
    {
      var v, id=wrapper.id
      for(var i in Ts)
      {
        if('function'!=typeof(v=Ts[i]) &&
           'function'!=typeof(v=JST[v]))
          throw new Error("JST['"+Ts[i]+"'] not found or incorrect!")
        Ts[i]=renderable(v, wrapper, Number(i)+1)
      }
      wrapper.id=id
      bound=true
    }
  }

  var interface={
    compile: compile,
    renderable: compile,
    $compile: $compile,
    JSTs: JSTs
  }
  if('undefined'!=typeof module && module.exports)
    module.exports=interface
  else if('function'==typeof define && define.amd)
    define(interface)
  else
    this.withOut=interface
})()

//--[EOF]------------------------------------------------------------
