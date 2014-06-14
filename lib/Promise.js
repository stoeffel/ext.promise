Ext.define('Ext.promise.Promise', function() {
    function createCallback(deferred, deferredFunction, callback, scope) {
        scope = scope || this;
        return function(value) {
            value = callback.call(scope, value);
            if (value instanceof Ext.promise.Promise) {
                value.then(function(value) {
                    deferred.resolve(value);
                }).fail(function(error) {
                    deferred.reject(error);
                });
            } else {
                deferredFunction.call(deferred, value);
            }
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
            var deferred = Ext.create('Ext.promise.Deferred');
            this.thenCallback = createCallback(deferred, deferred.resolve, callback, scope);

            if (this.state === Ext.promise.Deferred.STATE.FULFILLED) {
                return this.thenCallback(this.resolvedValue);
            }
            return deferred.promise;
        },

        fail: function(callback, scope) {
            var deferred = Ext.create('Ext.promise.Deferred');
            this.failCallback = createCallback(deferred, deferred.reject, callback, scope);

            if (this.state === Ext.promise.Deferred.STATE.REJECTED) {
                return this.failCallback(this.rejectedError);
            }
            return deferred.promise;
        }
    };
});
