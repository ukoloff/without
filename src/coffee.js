function coffeeScript()
{
  if(1 != arguments.length || 'function' != typeof arguments[0])
    throw SyntaxError('Usage: coffeescript -> code')
  html += '<script><!--\n(' + arguments[0].toString() + ')()\n//-->\n</script>';
}
