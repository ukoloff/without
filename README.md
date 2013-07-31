# without

Yet another CoffeScript template (without `with`, coffescript, options and templates)

## Usage

* General usage

```coffee
func=withOut.renderable ->
  div id: 'Main', =>
    span @msg

$('#output').html func.call msg: "Hello"
```

* Recompiling JST

```coffee
# app/assets/javascripts/t/t1.jst.coffee
return ->
  div id: 'main', =>
    span @msg

# app/assets/javascripts/t/t2.jst.coffee
return ->
  div id: 'second', =>
    $var @msg

```

```javascript
// Later in JavaScript
func=withOut.JSTs('t/t1', 't/t2')
$('#output').html(func({msg: 'Hello'}))
```

## Passing data

* Using `@`

See above

* Using argument(s)

```coffee
func=withOut.renderable (data)->
  div id: 'Main', ->
    span data.msg

$('#output').html func msg: "Hello"
```

Both ways are supported. You can even mix them in one call.

## Fat arrow

With `@` passing style template engine does it best to correctly set `this` in all nested functions.
It suits most templates but can fail in some complex scenarios.

Fortunately, coffeescript itself can handle it! Just use fat arrow `=>` **inside** template function.
The arrow **outside** must remain slim `->` (see examples above). If you don't use `@` in template or 
in some function in it, you can also use `->` in that scope.

## Aliasing tags

Engine uses some `eval` magic to inject all tag names (`div`, `span`, `a`...)into template function.
It only fails with `<var>...</var>`, because it's reserved word in JavaScript. So function for `<var>`
tag is named `$var`.

You can also use same tag names (especialy `i`) inside your function as regular variables. But then
you cannot use that tags.

To fix - create some aliases:

```coffee
func=->
  $i=i
  $a=a
  div id: 'Main', =>
    ...
    for i in[1..@N]
      li -> $i '#'+i
```

or even

```coffee
func=->
  tag=
    i: i
    a: a
    var: $var
  div id: 'Main', =>
    ...
    for i in[1..@N]
      li -> tag.i '#'+i
```

## Legacy

Inspired by [ck](https://github.com/aeosynth/ck) and [Teacup](https://github.com/goodeggs/teacup)
