/**
 * This class acts as a interface to work with multiple promises
 */
Ext.define('Ext.promise.Collection', function() {
    return {
        alternateClassName: 'Ext.Promises',
        singleton: true,
        requires: ['Ext.promise.Promise', 'Ext.promise.Deferred'],

        /**
         * all waits for all promises to be resolved
         * @param {[Ext.promise.Promise]} [promises] The promises to wait for.
         * @param {Object} [scope] The scope of the called function.
         * @return {Ext.promise.Promise} A promise.
         */
        all: function(promises, scope) {
            var deferred = Ext.create('Ext.promise.Deferred'),
                count = 0;
            promises = this.toArray(promises);
            this.iterate(promises, function() {
                count = count + 1;
                if (count === promises.length) {
                    deferred.resolve.apply(deferred, arguments);
                }
            }, function() {
                deferred.reject.apply(deferred, arguments);
            }, scope);

            return deferred.promise;
        },

        /**
         * some waits for the first promise to be resolved
         * @param {[Ext.promise.Promise]} [promises] The promises to wait for.
         * @param {Object} [scope] The scope of the called function.
         * @return {Ext.promise.Promise} A promise.
         */
        some: function(promises, scope) {
            var deferred = Ext.create('Ext.promise.Deferred');
            promises = this.toArray(promises);
            this.iterate(promises, function() {
                deferred.resolve.apply(deferred, arguments);
            }, function() {
                deferred.reject.apply(deferred, arguments);
            }, scope);

            return deferred.promise;
        },

        toArray: function(value) {
            if (!Ext.isArray(value)) {
                value = [value];
            }

            return value;
        },

        iterate: function(promises, then, fail, scope) {
            scope = scope || this;
            Ext.Array.each(promises, function(promise) {
                promise
                    .then(then, scope)
                    .fail(fail, scope);
            });
        }
    };
});
