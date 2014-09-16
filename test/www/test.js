function require(path)
{
  return {'..': withOut, 'expect.js': expect}[path]
}

mocha.setup('bdd')

function mochaRun(){
  mocha.checkLeaks()
  // mocha.globals(['jQuery'])
  mocha.run()
}

function Quit(f)
{
  setTimeout(function(){f.parentElement.removeChild(f)})
}
