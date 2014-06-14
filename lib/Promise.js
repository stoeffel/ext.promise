Ext.define('Ext.promise.Promise', {
    config: {
        deferred: null,
        state: null,
        resolvedValue: null,
        thenCallback: null
    },

    constructor: function(config) {
        this.state = Ext.promise.Deferred.STATE.PENDING;
        this.deferred = config.deferred;
    },

    then: function(callback, scope) {
        var deferred = Ext.create('Ext.promise.Deferred');
        this.thenCallback = function(value) {
            value = callback.call(scope, value);
            deferred.resolve(value);
        };
        if (this.state === Ext.promise.Deferred.STATE.FULFILLED) {
            return this.thenCallback(this.resolvedValue);
        }
        return deferred.promise;
    }
});
