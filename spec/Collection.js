describe('Collection', function() {
    var never, d0, d1, d2, FULFILLED, REJECTED, PENDING;
    beforeEach(function(done) {
        Ext.Loader.setPath('Ext.promise', './lib');
        Ext.application({
            name: 'Promise',

            launch: function() {
                never = function() {
                    expect(false).toBeTruthy();
                };

                Ext.require(['Ext.promise.Deferred', 'Ext.promise.Collection'], function() {
                    FULFILLED = Ext.promise.Promise.STATE.FULFILLED;
                    PENDING = Ext.promise.Promise.STATE.PENDING;
                    REJECTED = Ext.promise.Promise.STATE.REJECTED;
                    d0 = Ext.create('Ext.promise.Deferred');
                    d1 = Ext.create('Ext.promise.Deferred');
                    d2 = Ext.create('Ext.promise.Deferred');
                    done();
                });
            }
        });
    });

    describe('all', function() {
        it('should wait for a promise to be resolved', function(done) {
            Ext.Promises.all(d0.promise).then(function() {
                done();
            });
            d0.resolve();
        });

        it('should wait for an array of promises to be resolved', function(done) {
            Ext.Promises.all([d1.promise, d2.promise]).then(function() {
                expect(d1.promise.state).toEqual(FULFILLED);
                expect(d2.promise.state).toEqual(FULFILLED);
                done();
            });
            d1.resolve();
            d2.resolve();
        });

        it('should invoke the onFulfilled on the promise to', function(done) {
            Ext.Promises.all([d1.promise, d2.promise]).then(function() {
                expect(d1.promise.state).toEqual(FULFILLED);
                expect(d2.promise.state).toEqual(FULFILLED);
                done();
            });
            d2.promise.next().then(function(value) {
                expect(value).toEqual(42);
            });
            d1.resolve(666);
            d2.resolve(42);
        });

        it('should call onRejected if one promise fails', function(done) {
            Ext.Promises.all([d1.promise, d2.promise]).fail(function() {
                expect(d1.promise.state).toEqual(FULFILLED);
                expect(d2.promise.state).toEqual(REJECTED);
                done();
            });
            d1.resolve();
            d2.reject();
        });
    });

    describe('some', function() {
        it('should wait for the first promise to be resolved', function(done) {
            Ext.Promises.some([d1.promise, d2.promise]).then(function() {
                expect(d1.promise.state).toEqual(FULFILLED);
                done();
            }).fail(never);
            d1.resolve();
            d2.reject();
        });

        it('should call onRejected if the first promise is rejected', function(done) {
            Ext.Promises.some([d1.promise, d2.promise]).then(never).fail(function() {
                expect(d1.promise.state).toEqual(REJECTED);
                done();
            });
            d1.reject();
            d2.resolve();
        });
    });
});
