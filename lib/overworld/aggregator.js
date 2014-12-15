// This class is real Aggregator instance
// but user was given IAggregator
var Aggregator = (function () {
    function Aggregator(aggregateFn) {
        this.aggregateFn = aggregateFn;
        this._map = {};
        aggregateFn(this);
    }
    Aggregator.prototype.on = function (eventName, fn) {
        if (this._map[eventName])
            throw 'doubled:' + eventName;
        this._map[eventName] = fn;
        return this;
    };
    Aggregator.prototype.init = function (props) {
        if (!this._map.init)
            throw 'aggregate does not defined';
        return this._map.init(props);
    };
    Aggregator.prototype.aggregate = function (props, state) {
        if (!this._map.aggregate)
            throw 'aggregate does not defined';
        return this._map.aggregate(props, state);
    };
    return Aggregator;
})();
module.exports = Aggregator;
