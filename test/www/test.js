GLOBAL={JST: JST={}}

function require(path)
{
}

htmlEntities={'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}

function h(s)
{
  return String(s).replace(/[&<>"]/g, function(e){return htmlEntities[e]})
}

function describe(name, fn)
{
  document.writeln('<li>', h(name), '</li><ul>')
  fn()
  document.writeln('</ul>')
}

function it(name, fn)
{
  document.writeln('<li>', h(name), '</li>')
}