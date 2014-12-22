# requires
global = require 'global'
global.Promise = require 'bluebird'
React   = require 'react'
Overworld = require '../../lib'
Overworld.setReact React

cnt = 0
window.portal = new Overworld.Portal()

class MainWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(() => portal)]
    onClick: ->
      @emit 'main:transitionToSub'

    back: ->
      @emit 'main:back'

    render: ->
      React.createElement 'div', {key: 'main'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'Main'+@props.cnt
        React.createElement 'button', {key: 'tosub', onClick: @onClick}, 'transition sub'
        React.createElement 'button', {key: 'baa', onClick: @back}, 'back'
        React.createElement 'p', {key: 'b'}, portal._nodes.reduce ((e, v) -> e + '-' + v.type), ''
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'initState', (props) -> {}
    .on 'aggregate', (props, state) ->
      {cnt: props.cnt}

  @subscriber: (subscribe) ->
    subscribe 'main:transitionToSub', -> (id) ->
      portal.pushWorld('sub', {cnt: cnt++})

    subscribe 'main:back', -> (id) ->
      portal.popWorld()

    subscribe 'lifecycle:created', -> ->
      console.log 'lifecycle:created of main'

    subscribe 'lifecycle:paused', -> ->
      console.log 'lifecycle:paused of main'

    subscribe 'lifecycle:resumed', -> ->
      console.log 'lifecycle:resumed of main'

class SubWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(()=> portal)]
    onClick: ->
      @emit 'sub:transitionToMain', Date.now().toString()

    back: ->
      @emit 'main:back'

    render: ->
      React.createElement 'div', {key: 'Sub'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'Sub'+@props.cnt
        React.createElement 'button', {key: 'tomain', onClick: @onClick}, 'transition main'
        React.createElement 'button', {key: 'baaaa', onClick: @back}, 'back'
        React.createElement 'p', {key: 'b'}, portal._nodes.reduce ((e, v) -> e + '-' + v.type), ''
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'initState', (props) -> {}
    .on 'aggregate', (props, state) -> {cnt: props.cnt}

  @subscriber: (subscribe) ->
    subscribe 'sub:transitionToMain', -> (id) ->
      portal.pushWorld('main', {cnt: cnt++})

    subscribe 'main:back', -> (id) ->
      portal.popWorld()

portal.link 'main', MainWorld
portal.link 'sub', SubWorld

window.addEventListener 'load', ->
  portal.mount(document.body);
  portal.transition 'main', {cnt: -1}
