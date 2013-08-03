# without

Yet another CoffeScript template (without `with`, coffescript, options and templates)

## Usage

* General usage

```coffee
func=withOut.compile ->
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

```js
// Later in JavaScript
func=withOut.JSTs('t/t1', 't/t2')
$('#output').html(func({msg: 'Hello'}))
```

## Passing data

* Using `@`

See above

* Using argument(s)

```coffee
func=withOut.compile (data)->
  div id: 'Main', ->
    span data.msg

$('#output').html func msg: "Hello"
```

Both ways are supported. You can even mix them in one call. Sometimes it's convenient to pass *two* data
sets into template.

Syntactic sugar for `withOut.compile()` named `$compile()` create template function, whose first argument
is also passed as `@`. `withOut.JSTs()` does this either. One can pass data to such a function in the first
(regular) argument and refer to it via `@`.

```coffee
tab=withOut.$compile(model, tabs)->
  <b>@name</b>
  ul class: 'nav nav-tabs' =>
    for t in tabs
      li => a href: '/book/'+@id+'/'+t.url, t.name  
  ...
# @id==model.id etc.
```

## Fat arrow

With `@` passing style template engine does it best to correctly set `this` in all nested functions.
It suits most templates but can fail in some complex scenarios.

Fortunately, coffeescript itself can handle it! Just use fat arrow `=>` **inside** template function.
The arrow **outside** must remain slim `->` (see examples above). If you don't use `@` in template or 
in some function in it, you can also use `->` in that scope.

If in doubt, use `=>`.

## Aliasing tags

Engine uses some `eval` magic to inject all tag names (`div`, `span`, `a`...) into template function.
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

If aliasing existing tag functions is not your dream - try:

## BYOT (Build Your Own Tag)

Inside template function you can create another function for any tag

```coffee
func=->
  myTag = tag 'www'
  div ->
    myTag 'google.com'
# <div><www>google.com</www></div>
```

For standard tag names it will detect tag emptiness, so `(tag 'br') id: 1` will produce `<br id="1">`,
not `<br id="1"></br>`. You can explicitly set type of created tag: `(tag 'br', false)()` gives
`<br></br>`, whereas `(tag 'div', true)()` just `<div>`.

## Pseudo-tags

Inside template function some other methods injected:

### `print`
Just outputs its arguments

```coffee
  div =>
    print "That's ", @user
    a href: '#', 'Read more'
```

is equivalent to:

```coffee
  div "That's ", @user, ->
    a href: '#', 'Read more'
```

### `raw`
Like `print`, but doesn't escape HTML

```coffee
  raw @breadcrumbs
```

### notag

`print` that can contain not only text, but any tags either. Think of `notag` as tag without name,
who doesn't wrap its contents into `<>`...`</>`. As regular tags, it can take attributes from the first
argument, but it silently ignores them (nowhere to put arguments into).

It may seem aimless, but think about:

```coffee
  td =>
    (if @id then a else notag) href: '/user/'+@id, @name
```

### `comment`
Add HTML-comment `<!--...-->`

```coffee
  div id: @id, =>
    comment =>
      span @msg
    a href: '#'...
```

Nested comment allowed.

### `blackhole`
Silently drops its contents and attributes. May be used to quickly cut HTML subtree (or include it back)

```coffee
  td ->
    blackhole ->
      a href: '#', "See more"
      print '...'
```
Just add/remove `#` to start of `blackhole` line *et voila*!

### `coffeescript`

Insert `<script>...</script>` with its argument compiled to JavaScript

```coffee
  coffeescript ->
    alert "Alerts suck!"
```

## HTML attributes

Normal tags (not pseudo-tags) support HTML attributes. Must be first (hash) argument to a tag.

Shorcuts `.class` and `#id` not supported - use general form 

```coffee
  a id: 'link_'+@i, class: "btn btn-primary", href: '#/item/'+@i, @name
```

Also `data-*` attributes supported:

```coffee
  span id: 'X', data: @obj, ->
    ...
```

## Nested templates

You can render template inside template

```coffee
# app/assets/javascripts/t/t3.jst.coffee
return ->
  div id: 'contents', =>
    raw withOut.JSTs('t/t2') @
```

## Legacy
Inspired by [ck](https://github.com/aeosynth/ck) and [Teacup](https://github.com/goodeggs/teacup)
