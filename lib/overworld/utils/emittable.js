var Emittable = {
    //search parent emitter
    _getEmitter: function () {
        var emittable = this;
        while (emittable && !emittable.props.emitter) {
            if (!emittable._owner)
                throw 'emitter is undefined';
            emittable = emittable._owner;
        }
        if (emittable.props.emitter == null)
            throw 'emitter is undefined';
        return emittable.props.emitter;
    },
    emit: function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var emitter = this._getEmitter();
        emitter.emit.apply(emitter, [eventName].concat(args));
    }
};
module.exports = Emittable;
