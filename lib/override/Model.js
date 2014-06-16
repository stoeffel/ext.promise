Ext.define('Ext.promise.override.Model', {
    override: 'Ext.data.Model',
    mixins: ['Ext.promise.Deferred'],
    statics: {
        load: function(id, options, session) {
            var deferred = Ext.create('Ext.promise.Deferred').deferred();
            options = options || {};

            options.success = options.success || function(record, operation) {
                deferred.resolve(record, operation);
            };
            options.failure = options.failure || function(record, operation) {
                deferred.reject(record, operation);
            };
            this.callParent([id, options, session]);
            return deferred.promise;
        }
    }
});
