/**
 * This class acts as a interface to create, resolve and reject a promise
 */
Ext.define('Ext.promise.Deferred', function() {

    return {
        requires: ['Ext.promise.Promise'],

        /**
         * creates a new promise
         */
        constructor: function() {
            this.deferred();
        },

        /**
         * creates a new promise
         * @return {Ext.promise.Promise} A new promise.
         */
        deferred: function() {
            this.promise = Ext.create('Ext.promise.Promise');
            return this;
        },

        /**
         * resolves a promise
         */
        resolve: function() {
            this.promise.resolve.apply(this.promise, arguments);
        },

        /**
         * rejects a promise
         */
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
