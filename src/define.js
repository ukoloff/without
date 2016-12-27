if('undefined' != typeof module && module.exports)
  module.exports = withOut
else if('function' == typeof define && define.amd)
  define(function() { return withOut })
else
  this.withOut = withOut
