function makeComment()
{
  var level = 0
  return function() { comment(arguments) }
  function comment(a)
  {
    html += level++? '<comment level="' + level + '">' : "<!-- "
    children(a)
    html += --level? '</comment>' : ' -->'
  }
}
