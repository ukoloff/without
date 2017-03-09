// Output single attribute
function attribute(k, v)
{
  if(null == v || false === v) return ''
  var me = ' ' + h(k)
  return true === v ? me : me + '="' + h(v) + '"'
}

// Output data-* attribute(s)
function nestAttr(prefix, obj)
{
  var me = ''
  for(var k in obj)
    me += 'object' == typeof obj[k] ?
      nestAttr(prefix + k + '-', obj[k])
      :
      attribute(prefix + k, obj[k])
  return me
}
