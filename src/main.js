// Compiler with @ syntax sugar
function withOut(fn)
{
  return $compile(fn)
}

function $compile(fn)
{
  var withOut = renderable(fn, template)
  return template

  function template(that) { return withOut.apply(that, arguments) }
}
