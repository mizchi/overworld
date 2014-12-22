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
    Aggregator.prototype.initState = function (props) {
        if (!this._map.initState)
            throw 'aggregate does not defined';
        return this._map.initState(props);
    };
    Aggregator.prototype.aggregate = function (props, state) {
        if (!this._map.aggregate)
            throw 'aggregate does not defined';
        return this._map.aggregate(props, state);
    };
    Aggregator.prototype.buildTemplateProps = function (props, state) {
        var _this = this;
        return new Promise(function (done) {
            var stateContext = state ? state : _this.initState(props);
            Promise.resolve(stateContext).then(function (state) {
                Promise.resolve(_this.aggregate(props, state)).then(function (templateProps) {
                    done({ props: props, state: state, templateProps: templateProps });
                });
            });
        });
    };
    return Aggregator;
})();
module.exports = Aggregator;
