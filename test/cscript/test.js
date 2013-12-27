WScript.Echo('Hello, world!')

var Sh = new ActiveXObject("WScript.Shell")

var z = Sh.Run('coffee -cp test/attr.coffee > AAAAA')
