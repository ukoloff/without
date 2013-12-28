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
var modules={
  '..': withOut,
  'expect.js': window.expect
}
GLOBAL={JST: JST={}}

var progress={run: 0, ok: 0}

allTests()

WScript.Echo('Tests:\t'+progress.ok+'/'+progress.run+"\nThat's all folks!")

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
  WScript.Echo(task+':')
  fn()
}

function it(line, fn)
{
  progress.run++
  WScript.Echo(' - '+line)
  try{ 
    fn()
    progress.ok++
  }
  catch(e)
  {
    WScript.Echo('\t#', e.description)
  }
}

function allTests()
{
  jsEval($.sh
    .Exec('node node_modules/coffee-script/bin/coffee test/cscript/tests.coffee')
    .StdOut.ReadAll())
}

//--[EOF]------------------------------------------------------------
