import World = require('../world');
function mixinFor(portal){
  return {
    emit: (eventName: string, ...args: any[]) => {
      if(portal instanceof Function) portal = portal();
      var emitter = portal.getActiveEmitter();
      emitter.emit.apply(emitter, [eventName].concat(args));
    }
  };
}

export = mixinFor;
