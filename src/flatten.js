// Flatten array/objects
function flatten(array)
{
  var v, r = []
  for(var i in array)
    if('object' == typeof(v = array[i]))
      r.push.apply(r, flatten(v))
    else
      r.push(v)
  return r
}
