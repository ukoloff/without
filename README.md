# withOut

[![Build Status](https://travis-ci.org/ukoloff/without.svg?branch=master)](https://travis-ci.org/ukoloff/without)
[![Build status](https://ci.appveyor.com/api/projects/status/mwtk1p80nigwgr6g?svg=true)](https://ci.appveyor.com/project/ukoloff/without)
[![NPM version](https://badge.fury.io/js/without.svg)](http://badge.fury.io/js/without)
[![Bower version](https://badge.fury.io/bo/without.svg)](https://badge.fury.io/bo/without)
[![Gem Version](https://badge.fury.io/rb/without-rails.svg)](http://badge.fury.io/rb/without-rails)

Yet another CoffeScript template
(without `with`, coffescript, options and templates)

## Concept

`without` was started as proof of concept -
a way to implement
[CoffeeScript][] templating with lexical scope,
without using `with`.
It appeared to be possible, simple
(just a couple of lines of code - see `build()` in source)
and (with some small extra ideas) even useful.

Some (very sound) reasons to use CoffeeScript
as template engine are listed in [CoffeeKup][],
`without` is just another implementation.

Main feature of `without` is that
template function is not altered in any way.
The only thing to change is context it is executed in.
It makes possible to pass it arbitrary arguments -
any number and names.
One can also use `@` as one of datasets,
passed to template.

CoffeeScript itself was intentially
excluded from `without` dependencies.
Feed `compile()` with already compiled function.
Main reason for this design is
ability to run `without` on JavaScript-only client,
where .coffee->.js compilation is performed on server side.
Or just include both without.js and coffee-script.js
on your client and use them together.

## Usage

```coffee
t = withOut ->
  div id: 'Main', =>
    span @msg

$ '#output'
.html t msg: "Hello"
```

### Recompiling JST

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
// Later in JavaScript...
t = withOut.JSTs('t/t1', 't/t2')
$('#output').html(t({msg: 'Hello'}))
```

One can pass paths to .JSTs() as plain parameters (see above),
or in array `.JSTs(['t/t1', 't/t2'])`,
or even values of some hash `.JSTs({one: 't/t1', two: 't/t2'}]`,
or mix all these ways (to any depth).

It's possible to directly pass a function as any JSTs argument.

```coffee
t = withOut.JSTs 't/t1', -> do hr
```

## Passing data

Generating the same HTML all the time
is not very interesting.
Templates usually need some data
to insert into output.

There are several ways to pass
some info into `withOut` templates:

### Via argument(s)

As mentioned above, `withOut` template can have
as many arguments as needed - from zero to infinity.

```coffee
t = withOut (id, icon, href, text)->
  a
    id: id
    href: href
    -> i class: "fa fa-#{icon}"
    text
```

One can pass parameters individually
or combine them into objects.

### Via @

JavaScript's functions get their data to process
both via arguments and `this`
(aka `@` in CoffeeScript).

So do `withOut` templates.

```coffee
t = withOut.compile (a, b, c)->
  dl ->
    dt 'this'
    dd @, br
    dt 'A'
    dd a, br
    dt 'B'
    dd b, br
    # ...

t.call self(), a(), b(), c()
```

But using `.call` is a bit annoying.
To make `@` even more handy
`withOut` template by default
passes it's first argument as `@` either:

```coffee
t = withOut (a)->
  # Here @==a
  div #...

t.call(data) == t(data)

# withOut.compile don't mix @ and arguments[0]
t2 = withOut.compile (a)->
  div @name
  div a.name # != @name

t2.call(data1, data2)
```

If you need explicitly pass `this` into template -
use `withOut.compile` and `t.call()`.

In most cases one prefers plain `withOut` and
plain `t(data)`:

```coffee
t = withOut ->
  a
    id: @id
    class: @class
    href: @href
    => i class: "fa fa-#{@icon}"
    @text

html = t id: 'link', class: 'btn btn-default', #...
```

In first versions so did special function
named `withOut.$compile()`.
Later (since v1.1.1)
this was delegated to `withOut` itself.

`withOut.JSTs` does the same.

`withOut.compile` is preserved to
retain full control over `this` and `arguments`.

### Via global variables

`withOut` templates are recompiled
before first rendering.

Because of that they cannot access
local variables available in the scope
they are declared in.

```coffee
myVar = 1;

t = withOut ->
  span id: myVar # ReferenceError: myVar is not defined!
```

But global variables are still accesible inside templates.
You can use `Math.max` or `process.pid`
(when in [Node.js][]).

If [Underscore][]/[Lodash][] or [jQuery][]
are imported as global variables (`_`/`$`)
you can use them inside `withOut` templates too.

### Via local variables

Finally, some emulation for local variables
was added to `withOut` using `.$` member
(of individual templates or `withOut` itself).

```coffee
withOut.$ ||= {}
withOut.$.myVar = 2016 # "Common" local var

t = withOut ->
  span id: myVar # Ok

alert t()

t2 = withOut ->
  span id: anotherVar # See below

t2.$ = anotherVar: 2016  # Local var

alert t2()
```

Locals are copied inside template when
the latter is recompiled,
ie on its first evaluation.

If `.$` is a function,
it is called at that moment
and its result is used instead.

Using special values for locals
one can create non-standard HTML tags
to use inside template(s).

```coffee
withOut.$ ||= {}
withOut.$.google = '<>'  # "Global" tag <google>...</google>
withOut.$.fb = '</>'     # "Global" tag <fb/>

t = withOut ->
  google "https://www.google.com/"
  fb href: "https://www.facebook.com/"
  ms "https://www.microsoft.com/"
  apple src: "http://www.apple.com/"

t.$ = ->   # Get locals on demand
  ms: "<>"      # Tag <ms>...</ms>
  apple: "</>"  # Tag <apple/>
```

This can be considered as alternative to `BYOT` described below.

## Fat arrow

With `@` passing style
template engine does it best to
correctly set `this` in all nested functions.
It suits most templates
but can fail in some complex scenarios.

Fortunately, coffeescript itself can handle it!
Just use fat arrow `=>` **inside** template function.
The arrow **outside** must remain slim `->`
(see examples above).
If you don't use `@` in template
or in some function in it,
you can also use `->` in that scope.

If in doubt, use `=>`.

## Aliasing tags

Engine uses some `eval` magic to inject all tag names
(`div`, `span`, `a`...) into template function.
It only fails with `<var>...</var>`,
because it's reserved word in JavaScript.
So function for `<var>`
tag is named `$var`.

You can also use same tag names (especialy `i`)
inside your function as regular variables.
But then you cannot use those tags.

To fix - create some aliases:

```coffee
func = ->
  $i = i
  $a = a
  div id: 'Main', =>
    ...
    for i in [1..@N]
      li -> $i '#' + i
```

or even

```coffee
func = ->
  tag =
    i: i
    a: a
    var: $var
  div id: 'Main', =>
    ...
    for i in [1..@N]
      li -> tag.i '#' + i
```

If aliasing existing tag functions is not your dream - try:

## BYOT (Build Your Own Tag)

Inside template function you can create another function for any tag

```coffee
func = ->
  myTag = tag 'www'
  div ->
    myTag 'google.com'
# <div><www>google.com</www></div>
```

For standard tag names
it will detect tag emptiness,
so `(tag 'br') id: 1` will produce `<br id="1">`,
not `<br id="1"></br>`.
You can explicitly set type of created tag:
`do tag 'br', false` gives `<br></br>`,
whereas `do tag 'div', true` just `<div>`.

HTML5 doctype is intentionally omitted from `withOut`.
If needed,
it can be generated as follow:

```coffee
(tag "!DOCTYPE", true) html: true
html ->
  head ->
     # ...
```

To add other doctypes, one should use `raw` pseudo-tag.

## Pseudo-tags

Inside template function some other methods are injected:

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

`print` is alias for `text`.

### `raw`

Like `text`, but doesn't escape HTML

```coffee
script =>
  raw '<!--\n', @js, '\n//-->'
```

### `notag`

`text` that can contain not only text,
but any tags either.
Think of `notag` as tag without name,
who doesn't wrap its contents into `<>`...`</>`.
Like regular tags,
it can take attributes from the first argument,
but it silently ignores them
(nowhere to put arguments into).

It may seem pointless, but think about:

```coffee
td =>
  (if @id then a else notag) href: "/user/#{@id}", @name
```

### `comment`

Add HTML-comment `<!-- ... -->`

```coffee
div id: @id, =>
  comment =>
    span @msg
  a href: '#'...
```

Nested comment allowed.

### `blackhole`

Silently drops its contents and attributes.
May be used to quickly cut HTML subtree (or include it back)

```coffee
td ->
  blackhole ->
    a href: '#', "See more"
    print '...'
```
Just add/remove `#` to beginning of `blackhole` line *et voila*!

### `coffeescript`

Insert `<script>...</script>`
with its argument compiled to JavaScript.

```coffee
coffeescript ->
  alert "Alerts suck!"
```

## HTML attributes

Normal tags (not pseudo-tags) support HTML attributes.
Must be first (hash) argument to a tag.

Shorcuts `.class` and `#id` not supported - use general form.

```coffee
a
  id: "link_#{@i}"
  class: "btn btn-primary"
  href: "#/item/#{@i}"
  @name
```

Also HTML5 `data-*` attributes
(including nested hashes) supported:

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
  * `npm test --www[=nnnn]` - start Web-server to test in browser
  * `npm test --win[=msie]` - test in [Windows Script Host][] (cscript, Microsoft's JScript)

## Debugging

Debugging coffee-script templates is always tricky task.
Since v1.1 `withOut` make some steps toward developer.

But if source function (fed to `.compile`) is minified,
these debugging facilities are disabled.

### Fake source file names

After creating template (but before first rendering)
you can set its id. Simply

``` coffee
t = withOut.compile ->
  ...

t.id = 'view/main/footer'

$('#footer').html t()
...
```

This name will be used to name source file,
where recompiled template sits.
Modern browsers (except Firefox?)
show these "fake" files
next to regular scripts found on webpage.

Templates without `id` set on first rendering
get automatic names (simply 1, 2, 3...)

Fresh generated templates
(just after `.$?compile` or `.JSTs`) have id=null.

### Breakpoint inside template

``` coffee
t = withOut ->
  ...

t.bp = 1
...
```
If you set `bp` property on template,
every its rendering will be paused on `debugger` statement
(which is situated inside without.js).
Hit `Step Into` (or F11) twice
and you'll get inside recompiled source code of template.
Step it, set breakpoints, incpect stack frames, anything.

You can globally disable such breakpointing
by setting `withOut.bp = false`.
If you set `withOut.bp = true`
any template will pause
(regardless of its own `.bp`).

For `.JSTs()` templates
`t.bp=1` means break on first component
(since JSTs may hold series of sub-templates),
`t.bp=2` breaks on second sub-template and so on.
`t.bp = true` breaks on all
sub-templates of JSTs-template.

## Installation

`withOut` is ready to be used in most environments:

### Plain script in browser

```html
<script src="without.js"></script>`
```

### [RequireJS][]

```js
require(['without'], function(withOut){ var t = withOut(...) })
```

### [Node.js][] (including [Browserify] and [Webpack][])

Use npm module [without][without.npm], eg

```sh
npm install -S without`
```

and

```coffee
withOut = require 'without'
```

### [Bower][]

```sh
bower install without
```

### [DocPad][]

Use [without][without.docpad] plugin.

```sh
docpad install without
```

### [Ruby][] on [Rails][] assets pipeline

Use gem [without-rails][]:

```sh
gem install without-rails
```

## Legacy
Inspired by [ck][]
and [Teacup][].

## Credits

* [Travis CI][]
* [AppVeyor][]

[CoffeeScript]: http://coffeescript.org/
[CoffeeKup]: https://github.com/mauricemach/coffeekup#_why
[RequireJS]: http://requirejs.org/
[Node.js]: http://nodejs.org/
[Browserify]: http://browserify.org/
[Webpack]: https://webpack.github.io/
[without.npm]: https://www.npmjs.org/package/without
[without.docpad]: https://github.com/ukoloff/docpad-plugin-without
[Bower]: http://bower.io/
[DocPad]: http://docpad.org
[Ruby]: https://www.ruby-lang.org/ru/
[Rails]: http://rubyonrails.org/
[without-rails]: rails
[Windows Script Host]: https://en.wikipedia.org/wiki/Windows_Script_Host
[ck]: https://github.com/aeosynth/ck
[Teacup]: https://github.com/goodeggs/teacup
[Travis CI]: https://travis-ci.org/
[AppVeyor]: http://www.appveyor.com/
[Underscore]: http://underscorejs.org/
[Lodash]: https://lodash.com/
[jQuery]: https://jquery.com/
