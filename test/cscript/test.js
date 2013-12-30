//
// withOut testing under Windows Scripting Host
//

$={
  sh: new ActiveXObject("WScript.Shell"),
  fso: new ActiveXObject("Scripting.FileSystemObject")
}

if('msie'==$.sh.Environment('Process')('npm_config_out'))
  $.msie = getIE()

jsLoad('withOut.js')
window={}
jsLoad('node_modules/expect.js/expect.js')
var modules={
  '..': withOut,
  'expect.js': window.expect
}

var progress={run: 0, ok: 0, errs:[]}

allTests()

function getIE()
{
  var x = new ActiveXObject('InternetExplorer.Application')
  x.Visible = true
  x.Navigate($.fso.GetParentFolderName(WScript.ScriptFullName)+'/test.html')
  return x
}

function jsEval(code)
{
  new Function(code)()
}

function jsLoad(name)
{
  jsEval($.fso.OpenTextFile(name).ReadAll())
}

function require(f)
{
  m=modules[f]
  if(m) return m
  throw Error("Module '"+f+"' not found!")
}

function describe(task, fn)
{
  this.it = it
  fn()

  function it(line, fn)
  {
    var fail
    progress.run++
    try{ fn() }catch(e){ fail = e }
    WScript.StdOut.Write(fail? '#' : '.')
    if(fail) progress.errs.push({task: task, line: line, error: fail.message})
    else progress.ok++
  }
}

function allTests()
{
  jsEval($.sh
    .Exec('node node_modules/coffee-script/bin/coffee test/cscript/tests.coffee')
    .StdOut.ReadAll())
  WScript.Echo()
  if(progress.errs.length)
  {
    WScript.Echo('Failed tests:')
    for(var i in progress.errs)
    {
      var e=progress.errs[i]
      WScript.Echo(Number(i)+1+'.', e.task, e.line, '#'+e.error)
    }
  }
  WScript.Echo('Tests:\t'+progress.ok+'/'+
    progress.run+' ('+Math.round(progress.ok/(progress.run||1)*100)+'%)')
  WScript.Echo("That's all folks!")
}

//--[EOF]------------------------------------------------------------
