Ext.define('Ext.promise.override.Msg', function() {
    var msgShow = Ext.Msg.show;
    Ext.Msg.show = function(cfg) {
        cfg = cfg || {};
        if (cfg.fn) {
            return msgShow.call(Ext.Msg, cfg);
        }
        var deferred = Ext.create('Ext.promise.Deferred').deferred();

        cfg.fn = function() {
            deferred.resolve.apply(deferred,arguments);
        };
        msgShow.call(Ext.Msg, cfg);
        return deferred.promise;
    };
    Ext.MessageBox.show = Ext.Msg.show;
    return {};
});
