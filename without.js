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
    scope={},
    html='',
    _this

  function h(s)
  {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function children(a)
  {
    for(var i in a)
    {
      var e=a[i]
      if(null==e) continue;
      if('function'==typeof e)
        e.call(_this)
      else
        html+=h(e)
    }
  }

  function fragments(a)
  {
    for(var i in a)
    {
      var e=a[i]
      if(null==e) continue;
      html+=h(e)
    }
  }

  function raw(a)
  {
    for(var i in a)
    {
      var e=a[i]
      if(null!=e)html+=e
    }
  }

  function makeTag(name, empty)
  {
    return function(){tag(arguments)}
    function attr(k, v)
    {
      if((null==v) || (false===v)) return
      if(('data'==k) && ('object'==typeof v))
      {
        for(k in v) attr('data-'+k, v[k])
        return
      }
      html+=' '+h(k)
      if(true===v) return
      html+='="'+h(v)+'"'
    }
    function tag(a)
    {
      html+='<'+name;
      if('object'==typeof a[0])
      {
       for(var k in a[0]) attr(k, a[0][k])
       a=[].slice.call(a, 1)
      }
      html+='>'
      if(empty && a.length) throw SyntaxError("<"+name+"> must have no content!")
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
    if((1!=arguments.length)||('function'!=typeof arguments[0]))
      throw SyntaxError('Usage: coffeescript -> code')
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

  scope.print=function(){fragments(arguments)}
  scope.raw=function(){raw(arguments)}
  scope.tag=adhocTag()
  scope.comment=makeComment()
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

  function setContext(fn){
    return (new Function(makeVars()+'\nreturn '+fn.toString())).call(scope)
  }

  function renderable(fn)
  {
    if('function'!=typeof fn) throw TypeError("Call: withOut.compile(function)");
    var pending=true
    return function()
    {
      if(pending)
      {
        fn=setContext(fn)
        pending=false
      }
      try
      {
        var that=_this, x=html
        _this=this
        html=''
        fn.apply(this, arguments)
        return html
      }
      finally
      {
        _this=that
        html=x
      }
    }
  }

  function compile(fn)
  {
    var withOut=renderable(fn);
    return function(){return withOut.apply(this, arguments)}
  }

  function $compile(fn)
  {
    var withOut=renderable(fn);
    return function(){return withOut.apply(arguments[0], arguments)}
  }

  var compiledJST=[]

  function JSTs(path)
  {
    var paths=arguments
    return function(){return JSTs.apply(arguments[0], arguments)}
    function fetchJST(path)
    {
      var z=compiledJST[path]
      if(z) return z
      z=JST[path]
      return compiledJST[path]=
        'function'==typeof z ?
          renderable(z) :
          function(){throw Error("JST['"+path+"'] not found or incorrect!")}
    }
    function JSTs()
    {
      var S=''
      for(var i in paths) S+=fetchJST(paths[i]).apply(this, arguments)
      return S
    }
  }

  var interface={
    compile: compile,
    renderable: compile,
    $compile: $compile,
    JSTs: JSTs
  }
  if(('undefined'!=typeof module) && module.exports)
    module.exports=interface
  else if(('function'==typeof define) && define.amd)
    define('withOut', [], function(){ return interface })
  else
    window.withOut=interface
})()

//--[EOF]------------------------------------------------------------
