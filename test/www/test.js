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
  setTimeout(stop)

  function stop()
  {
    f.elements[0].value = 'Close window'
    f.onsubmit = close
  }

  function close()
  {
    setTimeout(die)
  }

  function die()
  {
    window.close()
  }
}
