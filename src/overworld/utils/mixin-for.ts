import World = require('../world');
import utils = require('./utils');

function mixinFor(portal){
  return {
    emit: (eventName: string, ...args: any[]) => {
      if((typeof portal) === 'string') {
        if(!utils.mixinAliasMap[portal])
          throw portal+'is unknown'
        portal = utils.mixinAliasMap[portal];
      } else if(portal instanceof Function)
        portal = portal();

      var emitter = portal.getActiveEmitter();
      emitter.emit.apply(emitter, [eventName].concat(args));
    }
  };
}

export = mixinFor;
