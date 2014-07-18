/**
 * Adds promise to Ext.Ajax.
 */
Ext.define('Ext.promise.override.Ajax', function() {
    var request = Ext.Ajax.request;
    Ext.Ajax.request = function(options) {
        var deferred = Ext.create('Ext.promise.Deferred').deferred();
        options = options || {};
        options.success = options.success || function(response, options) {
            deferred.resolve(response, options);
        };
        options.failure = options.failure || function(response, options) {
            deferred.reject(response, options);
        };
        deferred.promise.returnValue = request.call(Ext.Ajax, options);
        return deferred.promise;
    };
    return {};
});
