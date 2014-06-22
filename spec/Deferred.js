describe('Promise', function() {
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

    describe('basics', function() {
        it('should be requirable', function(done) {
            Ext.require('Ext.promise.Deferred', function() {
                done();
            });
        });

        it('should exist', function() {
            expect(Ext.promise.Deferred).toBeDefined();
        });

    });

    describe('#then', function() {
        var deferred, onFulfilled, onRejected, spy;

        beforeEach(function() {
            deferred = Ext.create('Ext.promise.Deferred');
            onFulfilled = jasmine.createSpy('onFulfilled');
            onRejected = jasmine.createSpy('onRejected');
            spy = jasmine.createSpyObj('spy', ['after']);
            spy.onFulfilled = function() {
                this.after();
            };
        });

        it('should have a function then', function() {
            expect(deferred.promise.then).toBeDefined();
        });

        it('should call the onFulfilled, on resolve', function() {
            deferred.promise.then(onFulfilled).fail(function(){});
            deferred.resolve();
            expect(onFulfilled).toHaveBeenCalled();
        });

        it('should call the onFulfilled, only once', function() {
            deferred.resolve();
            deferred.promise.then(onFulfilled).fail(function(){});
            deferred.resolve();
            deferred.resolve();
            expect(onFulfilled.calls.count()).toEqual(1);
        });

        it('should call it with the scope', function() {
            deferred.promise.then(spy.onFulfilled, spy);
            deferred.resolve();
            expect(spy.after).toHaveBeenCalled();
        });

        it('should call it with the scope if there is an onRejected callback', function() {
            deferred.promise.then(spy.onFulfilled, Ext.emptyFn, spy);
            deferred.resolve();
            expect(spy.after).toHaveBeenCalled();
        });

        it('should call then even if the promise was resolved before', function() {
            deferred.resolve();
            deferred.promise.then(onFulfilled);
            expect(onFulfilled).toHaveBeenCalled();
        });

        it('should call then when a async onFulfilled is finish', function(done) {
            setTimeout(function() {
                deferred.resolve();
                expect(onFulfilled).toHaveBeenCalled();
                done();
            }, 500);
            deferred.promise.then(onFulfilled);
        });

        it('should get the resolved value', function() {
            deferred.resolve('foo');
            deferred.promise.then(onFulfilled);
            expect(onFulfilled).toHaveBeenCalledWith('foo');
        });

        it('should be chainable', function(done) {
            deferred.promise.fail(onRejected).then(onFulfilled).then(onFulfilled).fail(onRejected).then(function() {
                expect(onFulfilled.calls.count()).toEqual(2);
                expect(onRejected.calls.count()).toEqual(0);
                done();
            });
            deferred.resolve();
        });

        xit('should resolve new promise in then', function(done) {
            deferred.promise.then(function() {
                var deferred2 = Ext.create('Ext.promise.Deferred');
                setTimeout(function() {
                    deferred2.resolve('bar');
                }, 500);
                return deferred2.promise;
            }).then(function(value) {
                expect(value).toEqual('bar');
                done();
            });
            deferred.resolve();
        });

    });

    describe('#fail', function() {
        var deferred, callback, spy;
        beforeEach(function() {
            deferred = Ext.create('Ext.promise.Deferred');
            callback = jasmine.createSpy('callback');
            spy = jasmine.createSpyObj('spy', ['after']);
            spy.callback = function() {
                this.after();
            };
        });

        it('should have a function fail', function() {
            expect(deferred.promise.fail).toBeDefined();
        });

        it('should call the callback, on reject', function() {
            deferred.promise.then(Ext.emptyFn).fail(callback);
            deferred.reject();
            expect(callback).toHaveBeenCalled();
        });

        it('should call the onRejected, given to then', function() {
            deferred.promise.then(Ext.emptyFn, callback);
            deferred.reject();
            expect(callback).toHaveBeenCalled();
        });

        it('should not call then callback on reject', function() {
            deferred.promise.then(callback);
            deferred.reject();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should only be called once', function() {
            deferred.reject();
            deferred.promise.then(Ext.emptyFn, callback);
            deferred.reject();
            deferred.reject();
            expect(callback.calls.count()).toEqual(1);
        });

        xit('should resolve new promise in fail', function(done) {
            deferred.promise.fail(function() {
                var deferred2 = Ext.create('Ext.promise.Deferred');
                setTimeout(function() {
                    deferred2.resolve('bar');
                }, 500);
                return deferred2.promise;
            }).then(function(value) {
                expect(value).toEqual('bar');
                done();
            });
            deferred.reject();
        });

    });

    describe('mixin', function() {
        it('should be possible to use it as a mixin', function(done) {
            var munchkin;
            Ext.define('munchkin', {
                mixins: ['Ext.promise.Deferred'],
                loot: function() {
                    var deferred = this.deferred(),
                        me = this;
                    setTimeout(function() {
                        me.resolve('a sword');
                    }, 400);
                    return deferred.promise;
                }
            });
            munchkin = Ext.create('munchkin');
            munchkin.loot()
                .then(function(theLoot) {
                    expect(theLoot).toEqual('a sword');
                    done();
                });
        });
    });
});
