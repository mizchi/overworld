# requires
global = require 'global'
global.Promise = require 'bluebird'
React   = require 'react'
Overworld = require '../..'
Overworld.setReact React

window.portal = null

class HelloWorld extends Overworld.World
  @component: React.createClass
    mixins: [Overworld.mixinFor(-> portal)]
    onClick: ->
      @emit 'main:update', Date.now().toString()

    render: ->
      React.createElement 'div', {key: 'foo'}, [
        React.createElement 'h1', {key: 'h1'}, 'App'
        React.createElement 'button', {key: '1', onClick: @onClick}, 'click me'
        React.createElement 'p', {key: '2'}, @props.body
      ]

  @aggregator: (pipe) ->
    pipe
    .on 'initState', (props) -> {id: 'initial'}
    .on 'aggregate', (props, state) -> {body: 'body of '+state.id}

  @subscriber: (subscribe) ->
    subscribe 'main:update', (update) -> (id) ->
      update {id: id}

window.portal = new Overworld.Portal
portal.link 'hello', HelloWorld

window.addEventListener 'load', ->
  portal.mount(document.body)
  portal.transition('hello', {id: 'foo'})
