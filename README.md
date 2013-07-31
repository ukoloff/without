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

Both ways are supported. You can even mix them.

## Legacy

Inspired by [ck](https://github.com/aeosynth/ck) and [Teacup](https://github.com/goodeggs/teacup)
