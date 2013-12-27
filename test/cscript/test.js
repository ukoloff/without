//
// withOut testing under Windows Scripting Host
//

$={
  sh: new ActiveXObject("WScript.Shell"),
  fso: new ActiveXObject("Scripting.FileSystemObject")
}

jsLoad('withOut.js')
WScript.Echo(withOut)

function jsLoad(name)
{
  f=$.fso.OpenTextFile(name)
  fn=new Function(f.ReadAll())
  f.Close()
  fn()
}

//--[EOF]------------------------------------------------------------
