function makeComment()
{
  var level = 0
  return function() { comment.apply(this, arguments) }
  function comment()
  {
    html += level++? '<comment level="' + level + '">' : "<!-- "
    children(arguments)
    html += --level? '</comment>' : ' -->'
  }
}
