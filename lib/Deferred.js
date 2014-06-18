Ext.define('Ext.promise.Deferred', function() {
    return {
        requires: ['Ext.promise.Promise'],

        constructor: function() {
            this.deferred();
        },

        deferred: function() {
            this.promise = Ext.create('Ext.promise.Promise');
            return this;
        },

        resolve: function() {
            this.promise.resolve.apply(this.promise, arguments);
        },

        reject: function() {
            this.promise.reject.apply(this.promise, arguments);
        },

        getSuccessFailure: function(deferred) { //TODO move to a helper class (overried.helper)
            var callbacks = {};
            callbacks.success = callbacks.success || function() {
                deferred.resolve.apply(deferred, arguments);
            };
            callbacks.failure = callbacks.failure || function() {
                deferred.reject.apply(deferred, arguments);
            };
            return callbacks;
        }
    };
});
