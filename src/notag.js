function noTag(a)
{
  children('object' == typeof a[0] ? slice.call(a, 1) : a)
}
