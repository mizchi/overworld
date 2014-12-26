var utils = require('./utils');
function mixinFor(portal) {
    return {
        emit: function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if ((typeof portal) === 'string') {
                if (!utils.mixinAliasMap[portal])
                    throw portal + 'is unknown';
                portal = utils.mixinAliasMap[portal];
            }
            else if (portal instanceof Function)
                portal = portal();
            var emitter = portal.getActiveEmitter();
            emitter.emit.apply(emitter, [eventName].concat(args));
        }
    };
}
module.exports = mixinFor;
