describe('Overrides', function() {
    if (navigator.userAgent.indexOf('PhantomJS') > 0) {
        console.log('Overrides-suite is not working in phantomjs');
        return true;
    }
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

    describe('Ext.require', function() {
        beforeEach(function(done) {
            Ext.require('Ext.promise.override.Require', function() {
                done();
            });
        });
        it('should return a promise', function(done) {
            Ext.require(['Ext.promise.override.*']).then(function() {
                done();
            });
        });
    });

    describe('Ext.Msg', function() {
        beforeEach(function(done) {
            Ext.require('Ext.promise.override.Msg', function() {
                done();
            });
        });
        it('should return a promise', function(done) {
            Ext.Msg.alert('hello', 'world').then(function(yes) {
                expect(yes).toEqual('cancel');
                done();
            });
            setTimeout(function(){
                Ext.WindowMgr.getActive().close();
            },200);
            
        });

        it('shoud be possible to fetch the MessageBox via returns()', function(done) {
            var msgBox = Ext.Msg.alert('hello', 'world').then(function(yes) {
                expect(yes).toEqual('cancel');
                done();
            }).returns();
            setTimeout(function(){
                expect(msgBox instanceof Ext.window.MessageBox).toBeTruthy();
                msgBox.close();
            },200);
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

    describe('Store', function() {
        var store, errorStore;
        beforeEach(function(done) {
            Ext.require(['Ext.promise.override.Store', 'Fixtures.Store', 'Fixtures.ErrorStore'], function() {
                store = new Fixtures.Store();
                errorStore = new Fixtures.ErrorStore();
                done();
            });
        });

        describe('#load', function() {
            it('should return a promise', function() {
                expect(store.load().then).toBeDefined();
            });

            it('should call then on success', function(done) {
                store.load().fail(Ext.emptyFn).then(function(records) {
                    expect(records.length).toEqual(1);
                    done();
                }).fail(Ext.emptyFn);
            });

            it('should call fail on error', function(done) {
                errorStore.load().fail(function() {
                    done();
                });
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
                Fixtures.Model.load(1).fail(Ext.emptyFn).then(function(record) {
                    expect(record.get('name')).toEqual('Stoeffel');
                    done();
                }).fail(Ext.emptyFn);
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

        describe('#erase', function() {
            it('should call then on success', function(done) {
                var model = new Fixtures.Model();
                model.erase().then(function(record) {
                    done();
                });
            });
        });
    });
});
