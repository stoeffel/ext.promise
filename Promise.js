Ext.define('Ext.Promise', function() {
    Ext.define('Promise', {
        config: {
            state: null,
            resolvedValue: null,
            thenCallback: null
        },
        then: function(callback, scope) {
            this.thenCallback = callback.bind(scope);
            if (this.state === Ext.Promise.STATE.FULFILLED) {
                this.thenCallback(this.resolvedValue);
            }
        }
    });
    return {
        statics: {
            STATE: {
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },

        constructor: function() {
            this.deferred();
        },

        deferred: function() {
            this.promise = Ext.create('Promise');
            this.promise.state = Ext.Promise.STATE.PENDING;
            return this;
        },

        resolve: function(value) {
            this.promise.state = Ext.Promise.STATE.FULFILLED;
            this.promise.resolvedValue = value;
            if (this.promise.thenCallback) {
                this.promise.thenCallback(this.promise.resolvedValue);
            }
        }
    };
});
