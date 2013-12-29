GLOBAL={JST: JST={}}
var htmlEntities={'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}
var progress={total: 0, ok: 0}

function require(path)
{
  return {'..': withOut, 'expect.js': expect}[path]
}


function h(s)
{
  return String(s).replace(/[&<>"]/g, function(e){return htmlEntities[e]})
}

function report()
{
  document.writeln(progress.ok, '/', progress.total,
    ' (', Math.round(progress.ok/(progress.total||1)*100), '%)')
}

function describe(name, fn)
{
  document.writeln('<li>', h(name), '</li><ul>')
  fn()
  document.writeln('</ul>')
}

function it(name, fn)
{
  progress.total++
  document.writeln('<li>', h(name), '</li>')
  try
  {
    fn()
    progress.ok++
  }
  catch(e)
  {
  	console.log('Oops:', e.message)
  }
}
