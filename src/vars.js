// Create list of template local variables
function makeVars(scope)
{
  var v = []
  for(var tag in scope)
    v.push(tag + '=this.' + tag)
  return 'var ' + v.join(',')
}
