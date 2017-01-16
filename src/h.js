// HTML escaping
var htmlEntities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}

function h(s)
{
  return ('' + s).replace(/[&<>"]/g, function(e) { return htmlEntities[e] })
}
