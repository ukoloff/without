# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'without/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "without-rails"
  spec.version       = Without::Rails::VERSION
  spec.authors       = ["Stas Ukolov"]
  spec.email         = ["ukoloff@gmail.com"]
  spec.description   = "Use withOut with Rails"
  spec.summary       = "This gem provides withOut template engine for Rails application"
  spec.homepage      = "https://github.com/ukoloff/without-rails"
  spec.license       = "MIT"

  spec.files         = Dir['lib/**/*', 'vendor/**/*']
  spec.require_paths = ["lib"]

  spec.add_dependency  "railties"

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
end
