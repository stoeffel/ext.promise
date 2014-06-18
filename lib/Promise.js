Ext.define('Ext.promise.Promise', function() {

    return {
        config: { //TODO remove unused stuff
            state: null,
            resolvedValue: null,
            thenCallback: null,
            rejectedError: null,
            failCallback: null
        },

        constructor: function(config) {
            this.state = Ext.promise.Deferred.STATE.PENDING;
        },

        then: function(callback, scope) {
            this.thenCallback = this.createCallback(callback, scope); //TODO resolve maybe a better name

            if (this.state === Ext.promise.Deferred.STATE.FULFILLED) {
                this.thenCallback(this.resolvedValue);
            }
            return this;
        },

        fail: function(callback, scope) {
            this.failCallback = this.createCallback(callback, scope); //TODO reject maybe a better name

            if (this.state === Ext.promise.Deferred.STATE.REJECTED) {
                this.failCallback(this.rejectedError);
            }
            return this;
        },

        privates: {
            createCallback: function(callback, scope) {
                scope = scope || this;
                return function(value) {
                    callback.call(scope, value);
                };
            }
        }
    };
});
