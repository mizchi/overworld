require '../spec-helper'
AggregatorRunner = require '../../lib/overworld/aggregator'

describe "src/overworld/aggregator", ->
  describe '#buildTemplateProps', ->
    it 'should build templateProps', (done) ->
      aggr = new AggregatorRunner
        initState: (props) -> {b: 'b'}
        aggregate: (props, state) -> {props, state}

      aggr.buildTemplateProps({a: 'a'}).then (params) ->
        deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'b'}}
        done()

    it 'should build templateProps without initState', (done) ->
      aggr = new AggregatorRunner
        aggregate: (props) -> {props}

      aggr.buildTemplateProps({a: 'a'}).then (params) ->
        deepEqual params.templateProps, {props: {a: 'a'}}
        done()

    it 'should build templateProps with force initState', (done) ->
      aggr = new AggregatorRunner
        initState: (props) -> {b: 'b'} # Should be ignored
        aggregate: (props, state) -> {props, state}

      aggr.buildTemplateProps({a: 'a'}, {b: 'bbb'}).then (params) ->
        deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'bbb'}}
        done()

    it 'should build templateProps with force initState', (done) ->
      aggr = new AggregatorRunner
        initState: (props) -> {b: 'b'} # Should be ignored
        aggregate: (props, state) -> {props, state}

      aggr.buildTemplateProps({a: 'a'}, {b: 'bbb'}).then (params) ->
        deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'bbb'}}
        done()

    describe 'with Promise', ->
      it 'should build templateProps via Promise on aggregate', (done) ->
        aggr = new AggregatorRunner
          initState: (props) -> {b: 'b'}
          aggregate: (props, state) -> new Promise (done) =>
            setTimeout => done {props, state}

        aggr.buildTemplateProps({a: 'a'}).then (params) ->
          deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'b'}}
          done()

      it 'should build templateProps via Promise on aggregate and initState', (done) ->
        aggr = new AggregatorRunner
          initState: (props) -> new Promise (done) =>
            setTimeout => done {b: 'b'}
          aggregate: (props, state) -> new Promise (done) =>
            setTimeout => done {props, state}

        aggr.buildTemplateProps({a: 'a'}).then (params) ->
          deepEqual params.templateProps, {props: {a: 'a'}, state: {b: 'b'}}
          done()
