describe('Overrides', function() {
    beforeEach(function(done) {
        Ext.application({
            name: 'Promise',

            paths: {
                'Ext.promise': './lib',
                'Fixtures': './spec/fixtures'
            },

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

    describe('Model', function() {
        beforeEach(function(done) {
            Ext.require(['Ext.promise.override.Model', 'Fixtures.Model', 'Fixtures.ErrorModel'], function() {
                done();
            });
        });

        describe('#load (static)', function() {
            it('should return a promise', function() {
                expect(Fixtures.Model.load(1).then).toBeDefined();
            });

            it('should call then on success', function(done) {
                Fixtures.Model.load(1).then(function(record) {
                    expect(record.get('name')).toEqual('Stoeffel');
                    done();
                });
            });

            it('should call fail on error', function(done) {
                Fixtures.ErrorModel.load(2).fail(function() {
                    done();
                });
            });
        });
        describe('#load', function() {
            it('should call then on success', function(done) {
                var model = new Fixtures.Model();
                model.load().then(function(record) {
                    expect(record.get('name')).toEqual('Stoeffel');
                    done();
                });
            });
        });
        describe('#save', function() {
            it('should call then on success', function(done) {
                var model = new Fixtures.Model();
                model.save().then(function(record) {
                    expect(record.get('name')).toEqual('Stoeffel');
                    done();
                });
            });
        });
    });
});
