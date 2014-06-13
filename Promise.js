Ext.define('Ext.Promise', function() {
    Ext.define('Promise', {
        config: {
            deferred: null,
            state: null,
            resolvedValue: null,
            thenCallback: null
        },

        constructor: function(config) {
            this.state = Ext.Promise.STATE.PENDING;
            this.deferred = config.deferred;
        },

        then: function(callback, scope) {
            var deferred = Ext.create('Ext.Promise');
            this.thenCallback = function(value) {
                value = callback.call(scope, value);
                deferred.resolve(value);
            };
            if (this.state === Ext.Promise.STATE.FULFILLED) {
                return this.thenCallback(this.resolvedValue);
            }
            return deferred.promise;
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
            this.promise = Ext.create('Promise', {
                deferred: this
            });
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
