// Create list of template local variables
function makeVars()
{
  var v = []
  for(var tag in scope)
    v.push(tag + '=this.' + tag)
  return 'var ' + v.join(',')
}
