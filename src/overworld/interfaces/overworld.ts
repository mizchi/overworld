import utils = require('../utils/utils');
import mixinFor = require('../utils/mixin-for');
import Portal = require('../portal');
import World = require('../world');

interface Overworld {
  Portal: typeof Portal;
  World: typeof World;
  mixinFor: any;
  setReact: any;
}

export = Overworld;
