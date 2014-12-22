# requires
global = require 'global'
global.Promise = require 'bluebird'
React   = require 'react'
Overworld = require '../..'
Overworld.setReact React
window.app = new Overworld.Portal()
window.layout = new Overworld.Portal()

cnt = 0

class MainWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(() => app)]
    onClick: ->
      @emit 'main:transitionToSub'

    back: ->
      @emit 'main:back'

    render: ->
      React.createElement 'div', {key: 'main'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'Main'+@props.cnt
        React.createElement 'button', {key: 'tosub', onClick: @onClick}, 'transition sub'
        React.createElement 'button', {key: 'baa', onClick: @back}, 'back'
        React.createElement 'p', {key: 'b'}, app._nodes.reduce ((e, v) -> e + '-' + v.type), ''
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'initState', (props) -> {}
    .on 'aggregate', (props, state) ->
      {cnt: props.cnt}

  @subscriber: (subscribe) ->
    subscribe 'main:transitionToSub', -> (id) ->
      app.pushWorld('sub', {cnt: cnt++})

    subscribe 'main:back', -> (id) ->
      app.popWorld()

class SubWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(()=> app)]
    onClick: ->
      @emit 'sub:transitionToMain', Date.now().toString()

    back: ->
      @emit 'main:back'

    render: ->
      React.createElement 'div', {key: 'Sub'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'Sub'+@props.cnt
        React.createElement 'button', {key: 'tomain', onClick: @onClick}, 'transition main'
        React.createElement 'button', {key: 'baaaa', onClick: @back}, 'back'
        React.createElement 'p', {key: 'b'}, app._nodes.reduce ((e, v) -> e + '-' + v.type), ''
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'initState', (props) -> {}
    .on 'aggregate', (props, state) -> {cnt: props.cnt}

  @subscriber: (subscribe) ->
    subscribe 'sub:transitionToMain', -> (id) ->
      app.pushWorld('main', {cnt: cnt++})

    subscribe 'main:back', -> (id) ->
      app.popWorld()

class Layout extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(()=> layout)]
    onClick: ->
      @emit 'sub:transitionToMain', Date.now().toString()

    back: ->
      @emit 'main:back'

    render: ->
      React.createElement 'div', {key: 'Layout'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'App'
        React.createElement 'div', {key: 'itmustbeunique', ref: 'container'}
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'initState', (props) -> {}
    .on 'aggregate', (props, state) -> {}

  @subscriber: (subscribe) ->

app.link 'main', MainWorld
app.link 'sub', SubWorld

layout.link 'layout', Layout

window.addEventListener 'load', ->
  layout.mount document.querySelector('#layout')
  layout.transition('layout', {cnt: -1}).then ->
    node = layout._activeNode.instance.component.refs.container.getDOMNode()
    app.mount node
    app.transition('main', {cnt: -1})
