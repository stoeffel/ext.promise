Ext.define('Ext.promise.Promise', function() {

    return {
        statics: {
            STATE: {
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },
        config: { //TODO remove unused stuff
            state: null,
            resolvedValue: null,
            rejectedError: null,
        },

        constructor: function(config) {
            this.onFulfilled = Ext.emptyFn;
            this.onRejected = Ext.emptyFn;
            this.state = this.statics().STATE.PENDING;
        },

        then: function(callback, scope) {
            this.onFulfilled = this.createCallback(callback, scope);

            if (this.state === this.statics().STATE.FULFILLED) {
                this.onFulfilled(this.resolvedValue);
            }
            return this;
        },

        resolve: function() {
            this.resolvedValue = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.FULFILLED;
                this.onFulfilled(this.resolvedValue);
            }
        },

        fail: function(callback, scope) {
            this.onRejected = this.createCallback(callback, scope);

            if (this.state === this.statics().STATE.REJECTED) {
                this.onRejected(this.rejectedError);
            }
            return this;
        },

        reject: function() {
            this.rejectedError = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.REJECTED;
                this.onRejected(this.rejectedError);
            }
        },

        privates: {
            createCallback: function(callback, scope) {
                scope = scope || this;
                return function(args) {
                    callback.apply(scope, args);
                };
            }
        }
    };
});
