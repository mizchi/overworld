# Overworld

Meta flux framework for real application.

![](https://cdn0.iconfinder.com/data/icons/gcons-2/21/world7-512.png)

## CAUTION!!

This is under development with dog fooding by myself.

All API is unstable.

## Features

- Context transition on stack
- History with Cache
- TypeScript friendly
- CoffeeScript friendly
- Headless friendly

## Dependencies

- React
- Promise

## Examples

```coffee
global = window
global.Promise = require 'bluebird' # need something promise
global.React = require 'react'
Overworld = require 'overworld'

class HelloContext extends Overworld.Context
  @component: React.createClass
    mixins: [Overworld.Emittable]
    onClick: ->
      # This has this.props.emitter
      @emit 'main:update', Date.now().toString()

    render: ->
      React.createElement 'div', {}, [
        React.createElement 'h1', {}, 'App'
        React.createElement 'button', {key: '1', onClick: @onClick}, 'click me'
        React.createElement 'p', {key: '2'}, @props.body
      ]

  @aggregator:
     initState: (props) -> {}
     aggregate: (props, state) -> {body: 'stamp: '+state.timestamp}

  @subscriber: (subscribe) ->
    subscribe 'main:update', (context) -> (timestamp) ->
      context.update {timestamp}

portal = new Overworld.Portal
portal.link 'hello', HelloContext

window.addEventListener 'load', ->
  portal.mount(document.body)
  portal.transition('hello', {timestamp: 'foo'})
```

# API Documents

Warding and role

- Props : immutable params given at initialization
- State : mutable params created by context
- TemplateProps : params to be given to Component

## Overworld.Portal

```javascript
class Portal {
  // Associate name and context
  link(name: string, contextClass: typeof Context): void;

  // mount it on HTMLElement
  mount(el: HTMLElement): void;

  // transition to associated context by name
  transition(name: string, arg: any): Thenable<any>;
}
```

## Overworld.Context

```javascript
class Context<Props, State> {
  props: Props;
  state: State;
  update(): void;
  update(obj: State): void;
  update(fn: (t: State) => State): void;
}
```

## Overworld.IAggregator

```javascript
interface IAggregator<Props, State, TemplateProps>{
  // Initialize state with props
  initState(p: Props): State | Thenable<State>;

  // Build template properties with state and props.
  // Result of this will `setProps` to React component.
  aggregate(p: Props, s: State): TemplateProps | Thenable<TemplateProps>;
}
```

## Overworld.Emittable

Mixin for react class.

## Overworld.LifeCycle

- CREATED
- PAUSED
- RESUMED
- PAUSED

## TODO

- Enhance disposing by context switching
