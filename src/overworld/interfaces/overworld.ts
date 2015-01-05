import utils = require('../utils/utils');
import mixinFor = require('../utils/mixin-for');
import Portal = require('../portal');
import Context = require('../world');

interface Overworld {
  Portal: typeof Portal;
  Context: typeof Context;
  mixinFor: any;
  setReact: any;
}

export = Overworld;
