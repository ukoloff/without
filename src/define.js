// Export withOut
if('object' == typeof module && module.exports)
  // Node.js
  module.exports = withOut
else if('function' == typeof define && define.amd)
  // AMD
  define(function() { return withOut })
else
  // Browser
  this.withOut = withOut
