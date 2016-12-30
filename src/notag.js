// Tag without name
function noTag(a)
{
  children('object' == typeof a[0] ? shift(a) : a)
}
