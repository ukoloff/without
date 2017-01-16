// Output [nested] HTML comments
function makeComment()
{
  var level = 0
  return Comment

  function Comment() { comment(arguments) }

  function comment(a)
  {
    html += level++ ? '<comment level="' + level + '">' : "<!-- "
    children(a)
    html += --level ? '</comment>' : ' -->'
  }
}
