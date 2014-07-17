describe('Collection', function() {
    var p0, p1;
    beforeEach(function(done) {
        Ext.Loader.setPath('Ext.promise', './lib');
        Ext.application({
            name: 'Promise',

            launch: function() {
                Ext.require(['Ext.promise.Deferred', 'Ext.promise.Collection'], function() {
                    p0 = Ext.create('Ext.promise.Deferred');
                    done();
                });
            }
        });
    });

    describe('all', function() {
        it('should wait for all promises to be resolved', function(done) {
            Ext.Promise.all([p0]).then(function() {
                done();
            });
            p0.resolve();
        });

    });
});
