function globalTag(name, empty)
{
  global(name, !!empty)
}

function global(name, empty)
{
  if(!/^[\$\w]+$/.test(name))
    throw SyntaxError("Invalid tag name: " + name)
  makeScope()
  if('#' == empty)
  {
    delete scope[name]
    return
  }
  scope[name] = makeTag(name, empty)
}
