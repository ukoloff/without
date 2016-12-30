// Helper for array slicing
var slice = [].slice

// Drop first array element
function shift(a)
{
  return slice.call(a, 1)
}
