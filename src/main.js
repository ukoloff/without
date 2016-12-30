// Compiler with @ syntax sugar
function $compile(fn)
{
  var withOut = renderable(fn, wrapper)
  return wrapper

  function wrapper(that) { return withOut.apply(that, arguments) }
}
