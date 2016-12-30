// Export withOut
if('undefined' != typeof module && module.exports)
  // Node.js
  module.exports = $compile
else if('function' == typeof define && define.amd)
  // AMD
  define(function() { return $compile })
else
  // Browser
  this.withOut = $compile
