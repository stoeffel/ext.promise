Ext.define('Ext.promise.Deferred', function() {
    return {
        requires: ['Ext.promise.Promise'],
        statics: {
            STATE: { //TODO just use states in promise
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },

        constructor: function() {
            this.deferred();
        },

        deferred: function() { //TODO already a promise (new Deferred)? check it.
            this.promise = Ext.create('Ext.promise.Promise', {
                deferred: this
            });
            return this;
        },

        resolve: function(value) { //TODO what if no promise exists??
            this.promise.state = Ext.promise.Deferred.STATE.FULFILLED;
            this.promise.resolvedValue = value;
            if (this.promise.thenCallback) {
                this.promise.thenCallback(this.promise.resolvedValue);
            }
        },

        reject: function(error) {
            this.promise.state = Ext.promise.Deferred.STATE.REJECTED;
            this.promise.rejectedError = error;
            if (this.promise.failCallback) {
                this.promise.failCallback(this.promise.rejectedError);
            }
        },

        getSuccessFailure: function() { //TODO move to a helper class (overried.helper)
            var callbacks = {},
                me = this;
            callbacks.success = callbacks.success || function() {
                me.resolve.apply(me, arguments);
            };
            callbacks.failure = callbacks.failure || function() {
                me.reject.apply(me, arguments);
            };
            return callbacks;
        }
    };
});
