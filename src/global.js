function globalTag(name, empty)
{
  makeScope()
  if('#' == empty)
  {
   delete scope[name]
    return
  }
  scope[name] = makeTag(name, !!empty)
}
