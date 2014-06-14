Ext.define('Ext.promise.Deferred', function() {
    return {
        requires: ['Ext.promise.Promise'],
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
            this.promise = Ext.create('Ext.promise.Promise', {
                deferred: this
            });
            return this;
        },

        resolve: function(value) {
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
        }
    };
});
