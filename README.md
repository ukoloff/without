# without

Yet another CoffeScript template
(without `with`, coffescript, options and templates)

## Concept

`without` was started as proof of concept - a way to implement
[CoffeeScript](http://coffeescript.org/) templating with lexical scope,
without using `with`. It appeared to be possible, simple (just a couple
of lines of code - see `setContext()` in source) and (with some small
extra ideas) even useful.

Some (very sound) reasons to use CoffeeScript as template engine are listed
in [CoffeeKup](https://github.com/mauricemach/coffeekup#_why), `without` is just
another implementation.

Main feature of `without` is that template function is not altered in any
way. The only thing to change is context it is executed in. It makes possible
to pass it arbitrary arguments - any number and names. One can also use `@` as
one of datasets, passed to template.

CoffeeScript itself was intentially excluded from `without` dependencies.
Feed `compile()` with already compiled function. Main reason for this design
is ability to run `without` on JavaScript-only client, where .coffee->.js
compilation is performed on server side. Or just include both without.js and
coffee-script.js on your client and use them together.

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
One can pass paths to .JSTs() as plain parameters (see above),
or in array `.JSTs(['t/t1', 't/t2'])`,
or even values of some hash `.JSTs({one: 't/t1', two: 't/t2'}]`,
or mix all these ways (to any depth).

It's possible to directly pass a function as any JSTs argument.
In that case `.JSTs` works as advanced `$compile`.

```coffee
t = withOut.JSTs 't/t1', -> do hr
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

Both ways are supported. You can even mix them in one call.
Sometimes it's convenient to pass *two* (or even more!) data
sets into template.

Syntactic sugar for `withOut.compile()` named `$compile()` create
template function, whose first argument is also passed as `@`.
`withOut.JSTs()` does this either.
One can pass data to such a function in the first
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
you cannot use those tags.

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
not `<br id="1"></br>`. You can explicitly set type of created tag: `do tag 'br', false` gives
`<br></br>`, whereas `do tag 'div', true` just `<div>`.

## Pseudo-tags

Inside template function some other methods injected:

### `text`
Just outputs its arguments

```coffee
  div =>
    text "That's ", @user
    a href: '#', 'Read more'
```

is equivalent to:

```coffee
  div "That's ", @user, ->
    a href: '#', 'Read more'
```
`print` is alias for `text`

### `raw`
Like `text`, but doesn't escape HTML

```coffee
  script =>
    raw '<!--\n', @js, '\n//-->'
```

### `notag`

`text` that can contain not only text, but any tags either. Think of `notag` as tag without name,
who doesn't wrap its contents into `<>`...`</>`. As regular tags, it can take attributes from the first
argument, but it silently ignores them (nowhere to put arguments into).

It may seem pointless, but think about:

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

Also HTML5 `data-*` attributes (including nested hashes) supported:

```coffee
  input
    type: 'text'
    class: 'input-mini'
    name: 'month'
    placeholder: 'Month'
    required: true
    data:
      placement: 'right'  # Bootstrap's .tooltip()
      trigger: 'manual'
      title: 'Select month'
      date:               # Bootstrap's .datepicker()
        format: 'mm/yyyy'
        min: view: mode: 'months'
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

## Testing

  * `npm test` - test in node.js, using [mocha](http://visionmedia.github.io/mocha/)
  * `npm run-script test/www [--port=nnnn]` - start Web-server to test in browser
  * `npm run-script test/wsh [--out=msie]` - test in Windows Scripting Host (cscript, Microsoft's JScript)

## Debugging

Debugging coffee-script templates is always tricky task.
Since v1.1 `withOut` make some steps toward developer.

But if source function (fed to `.compile`) is minified, these debugging
facilities are disabled.

### Fake source file names

After creating template (but before first rendering) you can set its id. Simply

``` coffee
t = withOut.compile ->
  ...

t.id = 'view/main/footer'

$('#footer').html t()
...
```

This name will be used to name source file, where recompiled template sits.
Modern browsers (except Firefox?) show these "fake" files next to regular scripts
found on webpage.

Templates without `id` set on first rendering get automatic names (simply 1, 2, 3...)

Fresh generated templates (just after `.$?compile` or `.JSTs`) have id=null.

### Breakpoint inside template

``` coffee
t = withOut.compile ->
  ...

t.bp = 1
...
```
If you set `bp` property on template, every its rendering will be paused on `debugger`
statement (which is situated inside without.js). Hit `Step Into` (or F11) twice
and you'll get inside recompiled source code of template.
Step it, set breakpoints, incpect stack frames, anything.

You can globally disable such breakpointing by setting `withOut.bp = false`.
If you set `withOut.bp = true` any template will pause (regardless of its own `.bp`).

For `.JSTs()` templates `t.bp=1` means break on first component (since JSTs may hold series
of sub-templates), `t.bp=2` breaks on second sub-template and so on.
`t.bp = true` breaks on all sub-templates of JSTs-template.

## Legacy
Inspired by [ck](https://github.com/aeosynth/ck)
and [Teacup](https://github.com/goodeggs/teacup)
