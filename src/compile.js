function compile()
{
  return function withOut(fn)
  {
    return compile(fn)
  }

  function compile(fn)
  {
    var withOut = renderable(fn, template)
    return template

    function template() { return withOut.apply(this, arguments) }
  }
}
