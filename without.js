//
// without.js - CoffeScript template engine with lexical scoping
//

withOut=(function()
{
  var
    html='',
    options= {autoesc: true},
    entities={amp: '&', lt: '<', gt: '>', quot: '"'},
    scope={}

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
      autoesc=options.autoesc
      for(var i in a)
      {
        var e=a[i]
        if(null==e) continue;
        if(nested && ('function'==typeof e))
        {
         e()
         continue
        }
        html+=autoesc? h(e):e
      }
    }
  }

  var fragments=makeLists()
  var children=makeLists(true)

  scope.print=function(){fragments(arguments)}

  return {
    dump: function(){ console.log(html); html='' },
    h: h,
    fragments: fragments, 
    children: children,
    scope: scope
  }
})()


//--[EOF]------------------------------------------------------------
