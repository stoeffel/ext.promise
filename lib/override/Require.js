Ext.define('Ext.promise.override.Require', function() {
    var extRequire = Ext.require;
    Ext.require = function(expressions, fn, scope) {
        if (fn) {
            return extRequire.call(Ext, expressions, fn, scope);
        }
        var deferred = Ext.create('Ext.promise.Deferred').deferred();
        
        deferred.promise.returnValue = extRequire.call(Ext, expressions, function() {
            deferred.resolve();
        }, scope);
        return deferred.promise;
    };
    return {};
});
