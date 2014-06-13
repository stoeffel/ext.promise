Ext.define('Ext.Promise', function() {
    return {
        statics: {
            STATE: {
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },
        
        config: {
            state: null,
            resolvedValue: null,
            thenCallback: null
        },

        constructor: function() {
            this.state = Ext.Promise.STATE.PENDING;
        },


        then: function(callback, scope) {
            this.thenCallback = callback.bind(scope);
            if (this.state === Ext.Promise.STATE.FULFILLED) {
                this.thenCallback(this.resolvedValue);
            }
        },

        resolve: function(value) {
            this.state = Ext.Promise.STATE.FULFILLED;
            this.resolvedValue = value;
            if (this.thenCallback) {
                this.thenCallback(this.resolvedValue);
            }
        }
    };
});
