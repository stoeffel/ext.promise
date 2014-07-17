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

        it('should be chainable by returning a new promise', function(done) {
            deferred.promise.fail(onRejected).then(function(value){
                var p = Ext.create('Ext.promise.Deferred');
                p.resolve(42);
                return p.promise;
            }).then(function(value) {
                expect(value).toEqual(42);
                done();
            });
            deferred.resolve();
        });


        it('should be chainable by returning a new promise with fail', function(done) {
            deferred.promise.then(function(value){
                var p = Ext.create('Ext.promise.Deferred');
                p.reject(42);
                return p.promise;
            }).fail(function(value) {
                var p = Ext.create('Ext.promise.Deferred');
                p.resolve('bad');
                expect(value).toEqual(42);
                return p.promise;
            }).then(function(value) {
                expect(value).toEqual('bad');
                done();
            });
            deferred.resolve();
        });

        it('should resolve the returned value', function(done) {
            deferred.promise.then(function() {
                return 'bar';
            }).then(function(value) {
                expect(value).toEqual('bar');
                done();
            });
            deferred.resolve('foo');
        });

        it('should resolve the original value if nothing returned', function(done) {
            deferred.promise.then(function() {
            }).then(function(value) {
                expect(value).toEqual('foo');
                done();
            });
            deferred.resolve('foo');
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

        it('should resolve new promise in fail', function(done) {
            deferred.promise.fail(function() {
                return 'bar';
            }).fail(function(value) {
                expect(value).toEqual('bar');
                done();
            });
            deferred.reject('foo');
        });

    });

    describe('#done', function() {
        var deferred, allways;

        beforeEach(function() {
            deferred = Ext.create('Ext.promise.Deferred');
            allways = function(done, expected) {
                return function(value) {
                    expect(value).toEqual(expected);
                    done();
                };
            };
        });

        it('should be called on resolve', function(done) {
            deferred.promise.then(function(value){
                return value;
            }).done(allways(done, 'onFulfilled'));
            deferred.resolve('onFulfilled');
        });

        it('should be called on reject', function(done) {
            deferred.promise.done(allways(done, 'onRejected'));
            deferred.reject('onRejected');
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

    describe('#returns', function(){
        var deferred, allways;

        beforeEach(function() {
            deferred = Ext.create('Ext.promise.Deferred');
        });

        it ('should return the returnValue of the Promise', function() {
            deferred.promise.returnValue = 42;
            var result = deferred.promise.then(function(){

            }).returns();
            expect(result).toEqual(42);
        });

        it ('should return the returnValue of the Promise even if chained', function() {
            deferred.promise.returnValue = 42;
            var result = deferred.promise.then(function(){
                var d = Ext.create('Ext.promise.Deferred');
                d.promise.returnValue = 44;
                return d.promise;
            }).then(function() {

            }).returns();
            expect(result).toEqual(42);
        });

        it ('should return the returnValue the first promise', function() {
            deferred.promise.returnValue = 42;
            var result = deferred.promise.returns();
            expect(result).toEqual(42);
        });

        it ('should return the returnValue of null if returnValue is not set.', function() {
            var result = deferred.promise.returns();
            expect(result).toBeNull();
        });
    });
});
