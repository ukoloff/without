function globalTag(name, empty)
{
  global(name, !!empty)
}

function global(name, empty)
{
  makeScope()
  if('#' == empty)
  {
    delete scope[name]
    return
  }
  scope[name] = makeTag(name, empty)
}
