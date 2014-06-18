Ext.define('Ext.promise.Promise', function() {
    function createCallback(callback, scope) {
        scope = scope || this;
        return function(value) {
            callback.call(scope, value);
        };
    }

    return {
        config: {
            deferred: null,
            state: null,
            resolvedValue: null,
            thenCallback: null,
            rejectedError: null,
            failCallback: null
        },

        constructor: function(config) {
            this.state = Ext.promise.Deferred.STATE.PENDING;
            this.deferred = config.deferred;
        },

        then: function(callback, scope) {
            this.thenCallback = createCallback(callback, scope);

            if (this.state === Ext.promise.Deferred.STATE.FULFILLED) {
                this.thenCallback(this.resolvedValue);
            }
            return this;
        },

        fail: function(callback, scope) {
            this.failCallback = createCallback(callback, scope);

            if (this.state === Ext.promise.Deferred.STATE.REJECTED) {
                this.failCallback(this.rejectedError);
            }
            return this;
        }
    };
});
