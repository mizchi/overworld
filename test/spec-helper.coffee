Overworld = require '../lib/index'
global.React = require 'react'
assert = require 'assert'

Overworld.setReact React

cheerio = require 'cheerio'
global.$ = (html) -> cheerio.load html

global.ok = assert.ok
global.equal = assert.equal
