Portal = require '../../lib/overworld/portal'
assert = require 'assert'

describe "src/overworld/portal", ->
  # it "should be written", ->
  #   portal = new Portal()
  #

  describe 'mount', ->
    it 'should set el', ->
      portal = new Portal()
      el = {}
      portal.mount el
      assert.equal portal.el,  el
