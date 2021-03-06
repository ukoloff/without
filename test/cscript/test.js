//
// withOut testing under Windows Scripting Host
//

$={
  sh: new ActiveXObject("WScript.Shell"),
  fso: new ActiveXObject("Scripting.FileSystemObject")
}

if(1==WScript.Arguments.length && 'msie'==WScript.Arguments(0))
  $.msie = getIE()

window=this
jsLoad('without.js')
jsLoad('node_modules/expect.js/index.js')
var modules={
  '..': this.withOut,
  'expect.js': this.expect
}

var progress={run: 0, ok: 0, errs:[]}

allTests()

function getIE()
{
  var x = new ActiveXObject('InternetExplorer.Application')
  x.Visible = true
  initIE(x)
  return x
}

function initIE(ie)
{
  ie.Navigate('about:blank')
  while(ie.Busy) WScript.Sleep(100)
  var name = $.fso.GetParentFolderName(WScript.ScriptFullName)+'/test.'
  ie.document.writeln(
    $.fso.OpenTextFile(name+'html').ReadAll().replace(
      '@CSS@',
      $.fso.OpenTextFile(name+'css').ReadAll()
    )
  )
}

function setOutput(id)
{
  if(!$.msie)
    return WScript.Echo()
  $.log = $.msie.document.getElementById(id)
}

function out(S)
{
  if($.msie)
    $.log.innerText+=S
  else
    WScript.StdOut.Write(S)
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
    out(fail? '#' : '.')
    if(fail) progress.errs.push({task: task, line: line, error: fail.message})
    else progress.ok++
  }
}

function allTests()
{
  setOutput('progress')
  jsEval($.sh
    .Exec('node_modules\\.bin\\coffee.cmd test/cscript/tests.coffee')
    .StdOut.ReadAll())
  if(progress.errs.length)
  {
    setOutput('e2')
    out('Failed tests:')
    setOutput('errors')
    for(var i in progress.errs)
    {
      var e=progress.errs[i]
      out(Number(i)+1+'. '+e.task+' '+e.line+' #'+e.error)
    }
  }
  setOutput('count')
  out('Tests:\t'+progress.ok+'/'+
    progress.run+' ('+Math.round(progress.ok/(progress.run||1)*100)+'%)')
  setOutput('bye')
  out("That's all folks!\n")
}

//--[EOF]------------------------------------------------------------
