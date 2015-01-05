var Emittable = {
    emit: function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var emitter = this.props.emitter;
        if (!emitter) {
            throw 'emitter is undefined';
        }
        emitter.emit.apply(emitter, [eventName].concat(args));
    }
};
module.exports = Emittable;
