Ext.define('Ext.Promise', function() {
    var state, thenCallback, resolvedValue;
    return {
        statics: {
            STATE: {
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },

        constructor: function() {
            state = this.self.STATE.PENDING;
        },


        then: function(callback, scope) {
            thenCallback = callback.bind(scope);
            if (state === this.self.STATE.FULFILLED) {
                thenCallback(resolvedValue);
            }
        },

        resolve: function(value) {
            state = this.self.STATE.FULFILLED;
            resolvedValue = value;
            if (thenCallback) {
                thenCallback(resolvedValue);
            }
        }
    };
});
