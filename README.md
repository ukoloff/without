# without

Yet another CoffeScript template (without `with`, coffescript, options and templates)

## Usage

1. General usage

```coffee
func=withOut.renderable ->
  div id: 'Main', =>
    span @msg

$('#output').html func.call msg: "Hello"
```

2. Recompiling JST

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

## Legacy

Inspired by [ck](https://github.com/aeosynth/ck) and [Teacup](https://github.com/goodeggs/teacup)
