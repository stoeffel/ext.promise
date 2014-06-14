describe('Overrides', function() {
    beforeEach(function(done) {
        Ext.Loader.setPath('Ext.promise', './lib');
        Ext.application({
            name: 'Promise',

            launch: function() {
                Ext.require('Ext.promise.Deferred', function() {
                    done();
                });
            }
        });
    });

    describe('Ajax', function() {
        beforeEach(function(done) {
            Ext.require('Ext.promise.override.Ajax', function() {
                done();
            });
        });

        it('should return a promise', function() {
            expect(Ext.Ajax.request({
                url: './spec/fixtures/test.json'
            }).then).toBeDefined();
        });

        it('should call then on success', function(done) {
            Ext.Ajax.request({
                url: './spec/fixtures/test.json'
            }).then(function(response) {
                var content = Ext.JSON.decode(response.responseText);
                console.log(response);
                expect(content).toEqual({
                    success: true
                });
                done();
            });
        });

        it('should call fail on error', function(done) {
            Ext.Ajax.request({
                url: 'fail.json'
            }).fail(function(response) {
                expect(response.status).toEqual(404);
                done();
            });
        });
    });
});
