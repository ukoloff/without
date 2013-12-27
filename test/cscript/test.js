//
// withOut testing under Windows Scripting Host
//

$={
  sh: new ActiveXObject("WScript.Shell"),
  fso: new ActiveXObject("Scripting.FileSystemObject")
}

jsLoad('withOut.js')
window={}
jsLoad('node_modules/expect.js/expect.js')
modules={
  '..': withOut,
  'expect.js': window.expect
}

coffeeLoad('test/meta.coffee')
coffeeLoad('test/2way.coffee')

function jsLoad(name, drop)
{
  f=$.fso.OpenTextFile(name)
  fn=new Function(f.ReadAll())
  f.Close()
  if(drop) $.fso.DeleteFile(name)
  fn()
}

function rnd(N)
{
 for(var S=''; S.length<(N||12); )
 {
  var n=Math.floor(62*Math.random())
  S+=String.fromCharCode('Aa0'.charCodeAt(n/26)+n%26)
 }
 return S
}

function tmp()
{
  var t=$.sh.ExpandEnvironmentStrings('%TEMP%/')
  do var n=t+rnd(); while($.fso.FileExists(n))
  return n
}

function coffeeLoad(name)
{
  t=tmp()
  $.sh.Run('coffee -cp "'+name+'" >"'+t+'"', 0, true)
  jsLoad(t, true)
}

function require(f)
{
  m=modules[f]
  if(m) return m
  throw Error("Module '"+f+"' not found!")
}

function describe(task, fn)
{
  WScript.Echo(task+':')
  fn()
}

function it(line, fn)
{
  WScript.Echo(' - '+line)
  try{ fn() }
  catch(e)
  {
    WScript.Echo('\t#', e.description)
  }
}

//--[EOF]------------------------------------------------------------
