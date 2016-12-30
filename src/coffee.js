// Output <script>
function coffeeScript(a)
{
  if(1 != a.length || 'function' != typeof a[0])
    throw SyntaxError('Usage: coffeescript -> code')
  html += '<script><!--\n(' + a[0].toString() + ')()\n//-->\n</script>';
}
