require '../spec-helper'
Aggregator = require '../../lib/overworld/aggregator'
describe "src/overworld/aggregator", ->
  describe '#buildTemplateProps', ->
    it 'should build templateProps', (done) ->
      aggr = new Aggregator (pipe) ->
        pipe.on 'initState', (props) -> {b: 'b'}
        pipe.on 'aggregate', (props, state)-> {props, state}

      aggr.buildTemplateProps({a: 'a'}).then (params) ->
        deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'b'}}
        done()

    it 'should build templateProps', (done) ->
      aggr = new Aggregator (pipe) ->
        pipe.on 'initState', (props) -> {b: 'b'} # should be ignored
        pipe.on 'aggregate', (props, state)-> {props, state}

      aggr.buildTemplateProps({a: 'a'}, {b: 'bbb'}).then (params) ->
        deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'bbb'}}
        done()
