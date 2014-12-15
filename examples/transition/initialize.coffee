# requires
global = require 'global'
global.Promise = require 'bluebird'
React   = require 'react'
Overworld = require '../..'
Overworld.setReact React

window.portal = null

class MainWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(-> portal)]
    onClick: ->
      @emit 'main:transitionToSub', Date.now().toString()

    render: ->
      React.createElement 'div', {key: 'main'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'Main'
        React.createElement 'button', {key: 'tosub', onClick: @onClick}, 'transition sub'
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'init', (props) -> {}
    .on 'aggregate', (props, state) -> {}

  @subscriber: (subscribe) ->
    subscribe 'main:transitionToSub', -> (id) ->
      portal.transition('sub', {})

    subscribe 'lifecycle:created', -> (id) ->
      console.log 'created'

    subscribe 'lifecycle:paused', -> (id) ->
      console.log 'paused'

class SubWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(-> portal)]
    onClick: ->
      @emit 'sub:transitionToMain', Date.now().toString()

    render: ->
      React.createElement 'div', {key: 'Sub'}, [
        React.createElement 'h1', {key: 'h1sub'}, 'Sub'
        React.createElement 'button', {key: 'tomain', onClick: @onClick}, 'transition main'
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'init', (props) -> {}
    .on 'aggregate', (props, state) -> {}

  @subscriber: (subscribe) ->
    subscribe 'sub:transitionToMain', -> (id) ->
      portal.transition('main', {})

window.portal = new Overworld.Portal()
window.addEventListener 'load', ->
  portal.link 'main', MainWorld
  portal.link 'sub', SubWorld
  portal.mount(document.body)
  portal.transition 'main', {cnt: 0}
