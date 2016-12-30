// Direct template compiler
function compile(fn)
{
  var withOut = renderable(fn, wrapper)
  return wrapper

  function wrapper() { return withOut.apply(this, arguments) }
}
