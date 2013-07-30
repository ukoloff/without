//
// without.js - CoffeScript template engine with lexical scoping
//

withOut=(function()
{
  var
    html='',
    entities={amp: '&', lt: '<', gt: '>', quot: '"'},
    nTags='a abbr acronym address applet article aside audio b bdo big blockquote body button \
canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt \
em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html \
i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object \
ol optgroup option output p pre progress q rp rt ruby \
s samp script section select small source span strike strong style sub summary sup \
table tbody td textarea tfoot th thead time title tr tt u ul video wbr xmp'.split(' '),
    eTags='area base basefont br col frame hr img input link meta param'.split(' '),
    scope={},
    _this

  function h(s)
  {
   s=''+s
   for(var i in entities)
     s=s.split(entities[i]).join("&"+i+";")
   return s
  }

  function makeLists(nested)
  {
    return function(a)
    {
      for(var i in a)
      {
        var e=a[i]
        if(null==e) continue;
        if(nested && ('function'==typeof e))
          e.call(_this)
        else
          html+=h(e)
      }
    }
  }

  function makeRaw()
  {
    return function(){raw(arguments)}
    function raw(a)
    {
      for(var i in a)
      {
        var e=a[i]
        if(null!=e)html+=e
      }
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
      fragments([' ', k])
      if(true===v) return
      html+='="'
      fragments([v])
      html+='"'
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
      if(empty && a.length) throw "<"+name+"> must have no content!"
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
      html+= level++? '<comment level="'+level+'">' : "<!--"
      children(arguments)
      html+= --level? '</comment>': '-->'
    }
  }

  var fragments=makeLists()
  var children=makeLists(true)

  scope.print=function(){fragments(arguments)}
  scope.raw=makeRaw()
  scope.comment=makeComment()
  for(var i in nTags) scope[nTags[i]]=makeTag(nTags[i])
  scope.$var=makeTag('var')
  for(var i in eTags) scope[eTags[i]]=makeTag(eTags[i], true)

  function makeVars()
  {
    var v=[];
    for(var tag in scope) v.push(tag+'=this.'+tag)
    return 'var '+v.join(',')+';'
  }

  function wrap(fn){
    if('function'!=typeof fn) throw "Call: wrap(function)";
    return (new Function(makeVars()+'return '+fn.toString())).call(scope)
  }

  function renderable(fn)
  {
    fn=wrap(fn)
    return function(){ return withOut.apply(this, arguments) }
    function withOut()
    {
      _this=this;
      html=''
      fn.apply(this, arguments)
      x=html
      html=''
      return x
    }
  }

  return {
    renderable: renderable
  }
})()

//--[EOF]------------------------------------------------------------
