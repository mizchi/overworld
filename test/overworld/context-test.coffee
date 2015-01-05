require '../spec-helper'
Context = require '../../lib/overworld/context'
describe "lib/overworld/context", ->
  describe '#render', ->
    class Test1 extends Context
      @component: React.createClass
        render: ->
          React.createElement 'div', {key: 'foo', className: 'test', onClick: @onClick}, @props.body

    it "should render element", ->
      world = new Test1
      html = React.renderToString world.render(body: 'foo')
      equal $(html)('.test').text(), 'foo'

  describe '@aggregator', ->
    class Test2 extends Context
      @component: React.createClass
        render: ->
          React.createElement 'div', {key: 'foo', className: 'test', onClick: @onClick}, @props.body

      @aggregator:
        initState: (props) -> {y: 'y'}
        aggregate: (props, state) ->
          propX: props.x
          stateY: state.y
          templateZ: 'z'

    it "should render element", (done) ->
      world = new Test2
      world.aggregator.buildTemplateProps({x: 'x'}, {y: 'y'}).then (params) ->
        deepEqual params.templateProps, {propX: 'x', stateY: 'y', templateZ: 'z'}
        done()
