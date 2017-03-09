// Helper for array slicing
var slice = [].slice

// Drop first array element
function cdr(a)
{
  return slice.call(a, 1)
}
