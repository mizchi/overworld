require '../spec-helper'
Portal = require '../../lib/overworld/portal'

describe "src/overworld/portal", ->
  describe 'mount', ->
    it 'should set el', ->
      portal = new Portal()
      el = {}
      portal.mount el
      equal portal.el,  el
