if('undefined' != typeof module && module.exports)
  module.exports = $compile
else if('function' == typeof define && define.amd)
  define(function() { return $compile })
else
  this.withOut = $compile
