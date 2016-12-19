function noTag(attrs)
{
  children('object' == typeof attrs ? slice.call(arguments, 1) : arguments)
}
