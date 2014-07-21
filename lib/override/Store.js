/**
 * Adds promise to the Ext.data.Store class.
 */
Ext.define('Ext.promise.override.Store', {
    override: 'Ext.data.Store',
    load: function(options) {
        var deferred = Ext.create('Ext.promise.Deferred').deferred();
        options = options || {};
        options.callback = Ext.isFunction(options) || options.callback || function(records, operation, success) {
            if (success) {
                deferred.resolve.apply(deferred, arguments);
            } else {
                deferred.reject.apply(deferred, arguments);
            }
        };
        deferred.promise.returnValue = this.callParent([options]);
        return deferred.promise;
    }
});
