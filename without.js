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
    return function list(a)
    {
      for(var i in a)
      {
        var e=a[i]
        if(null==e) continue;
        if(nested && ('function'==typeof e))
          e.call(_this)
        else
          html+=e
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
    function attrs(a)
    {
      for(var k in a)
      {
        v=a[k]
        if((null==v) || (false===v)) continue
        fragments([' ', k])
        if(true!==v)
        {
          html+='="'
          fragments([v])
          html+='"'
        }
      }
    }
    function tag(a)
    {
      html+='<'+name;
      if('object'==typeof a[0]){attrs(a[0]); a=[].slice.call(a, 1)}
      html+='>'
      if(empty && a.length) throw "<"+name+"> must have no content!"
      if(empty) return
      children(a)
      html+="</"+name+">"
    }
  }

  var fragments=makeLists()
  var children=makeLists(true)

  scope.print=function(){fragments(arguments)}
  scope.raw=makeRaw();
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

  return {
    dump: function(){ console.log(html); html='' },
    h: h,
    fragments: fragments, 
    children: children,
    scope: scope,
    v: function(){ return makeVars() },
    wrap: wrap
  }
})()

//--[EOF]------------------------------------------------------------
