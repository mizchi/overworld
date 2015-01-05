# Overworld

![](https://cdn0.iconfinder.com/data/icons/gcons-2/21/world7-512.png)

## CAUTION!!

This is under development with dog fooding by myself.

All API is unstable.


## What is this?

Meta flux framework for real application.
Flux with application stack.


## Features

- Transition on stack
- TypeScript friendly
- CoffeeScript friendly
- Headless friendly(wip)
- Cacheable history

## Dependencies

- React
- Promise
- EventEmitter2

## Examples

```coffee
global = window
global.Promise = require 'bluebird' # need something promise
React = require 'react'

Overworld = require 'overworld'
Overworld.setReact React
window.portal = null

class HelloWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(-> portal)]
    onClick: ->
      @emit 'main:update', Date.now().toString()

    render: ->
      React.createElement 'div', {}, [
        React.createElement 'h1', {}, 'App'
        React.createElement 'button', {key: '1', onClick: @onClick}, 'click me'
        React.createElement 'p', {key: '2'}, @props.body
      ]

  @aggregator: (pipe) ->
    pipe
      .on 'init', (props) -> {}
      .on 'aggregate', (props, state) -> {body: 'body of '+state.timestamp}

  @subscriber: (subscribe) ->
    subscribe 'main:update', (update) -> (timestamp) ->
      update {timestamp}

window.portal = new Overworld.Portal
portal.link 'hello', HelloWorld

window.addEventListener 'load', ->
  portal.mount(document.body)
  portal.transition('hello', {timestamp: 'foo'})
```

# API Documents

WIP

## Component StateCycle

- Props : immutable params given at initialization
- State : mutable params created by context
- TemplateProps : params to be given to Component


###

- `Aggregator.prototype.on('initState', (props: Props) => State | Promise<State>);`
- `Aggregator.prototype.on('aggregate', (props: Props, state: State) => TemplateProps | Promise<TemplateProps>); `

## World LifeCycle

- CREATED
- PAUSED
- RESUMED
- PAUSED

## TODO

- Provide correct typescript definition
- Enhance disposing by context switching
- Doc site by itself
- Test
