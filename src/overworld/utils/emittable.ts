import World = require('../world');
import utils = require('./utils');
export = Emittable;

var Emittable = {
  emit: function(eventName: string, ...args: any[]){
    var emitter = this.props.emitter;
    if(!emitter){
      throw 'emitter is undefined';
    }
    emitter.emit.apply(emitter, [eventName].concat(args));
  }
}
