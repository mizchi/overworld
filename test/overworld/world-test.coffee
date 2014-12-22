require '../spec-helper'
World = require '../../lib/overworld/world'
describe "lib/overworld/world", ->
  describe '#render', ->
    class Test1 extends World
      @component: React.createClass
        render: ->
          React.createElement 'div', {key: 'foo', className: 'test', onClick: @onClick}, @props.body

    it "should render element", ->
      world = new Test1
      html = React.renderToString world.render(body: 'foo')
      equal $(html)('.test').text(), 'foo'

  describe 'Aggregator', ->
    class Test2 extends World
      @component: React.createClass
        render: ->
          React.createElement 'div', {key: 'foo', className: 'test', onClick: @onClick}, @props.body

      @aggregator: (pipe) ->
        pipe
          .on 'init', (props) -> {id: 'foo'}
          .on 'aggregate', (props, state) -> {body: state.id}

    it "should render element", ->
      world = new Test2
      # html = React.renderToString world.render(body: 'foo')
      # equal $(html)('.test').text(), 'foo'
