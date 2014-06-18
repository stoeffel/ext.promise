Ext.define('Ext.promise.override.Model', {
    override: 'Ext.data.Model',
    statics: {
        load: function(id, options, session) {
            var deferred = Ext.create('Ext.promise.Deferred').deferred();
            options = options || {};
            Ext.applyIf(options, deferred.getSuccessFailure(deferred));
            this.callParent([id, options, session]);
            return deferred.promise;
        }
    },
    load: function(options) {
        var deferred = Ext.create('Ext.promise.Deferred').deferred();
        options = options || {};
        Ext.applyIf(options, deferred.getSuccessFailure(deferred));
        this.callParent([options]);
        return deferred.promise;
    }
});
