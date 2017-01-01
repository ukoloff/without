# Without::Rails

[![Gem Version](https://badge.fury.io/rb/without-rails.svg)](http://badge.fury.io/rb/without-rails)

without-rails wraps [withOut](https://github.com/ukoloff/without)
template engine for simple use with rails asset pipeline.
The gem includes the development (non-minified) source
for ease of exploration.
The asset pipeline will minify in production.

## Installation

Add this line to your application's Gemfile:

    gem 'without-rails'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install without-rails

## Usage

Add the following directive to your Javascript manifest file
(application.js):


```js
//= require without
```

or to some .coffee file:


```coffee
#= require without
```

Later, inside any .coffee you can:

```coffee
t = withOut ->
  h1 'Hello, ', @, '!'

$('#test').html t 'world' # <h1>Hello, world!</h1>

```
