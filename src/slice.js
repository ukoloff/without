var slice = [].slice

function shift(a)
{
  return slice.call(a, 1)
}
