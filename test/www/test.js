function require(path)
{
  return {'..': this.withOut, 'expect.js': this.expect}[path]
}

mocha.setup('bdd')

function mochaRun(){
  mocha.checkLeaks();
  // mocha.globals(['jQuery']);
  mocha.run();
}
