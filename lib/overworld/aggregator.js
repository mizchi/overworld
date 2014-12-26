// This class is real Aggregator instance
// but user was given IAggregator
var Aggregator = (function () {
    function Aggregator(aggregator) {
        if (!aggregator.aggregate && aggregator instanceof Function)
            this.aggregator = new aggregator();
        else
            this.aggregator = aggregator;
        if (!this.aggregator.aggregate)
            throw 'aggregate does not defined';
    }
    Aggregator.prototype.callInitState = function (props) {
        if (this.aggregator.initState instanceof Function)
            return this.aggregator.initState(props);
    };
    Aggregator.prototype.callAggregate = function (props, state) {
        return this.aggregator.aggregate(props, state);
    };
    Aggregator.prototype.buildTemplateProps = function (props, forceState) {
        var _this = this;
        return new Promise(function (done) {
            var state = forceState ? forceState : _this.callInitState(props);
            Promise.resolve(state).then(function (nextState) {
                var templateProps = _this.callAggregate(props, nextState);
                Promise.resolve(templateProps).then(function (nextTemplateProps) {
                    done({ props: props, state: nextState, templateProps: nextTemplateProps });
                });
            });
        });
    };
    return Aggregator;
})();
module.exports = Aggregator;
