import utils = require('./utils');
export = Emittable;

var Emittable = {

  //search parent emitter
  _getEmitter: function(){
    var emittable = this;

    while(emittable && !emittable.props.emitter){
      if(!emittable._owner) throw 'emitter is undefined';
      emittable = emittable._owner;
    }
    if(emittable.emitter == null) throw 'emitter is undefined';

    return emittable.emitter;
  },

  emit: function(eventName: string, ...args: any[]){
    var emitter = this._getEmitter();
    emitter.emit.apply(emitter, [eventName].concat(args));
  }
}
