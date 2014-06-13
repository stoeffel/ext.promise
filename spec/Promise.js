describe('Promise', function() {
    beforeEach(function() {
        Ext.Loader.setPath('Ext.Promise', '../');
    });

    describe('basics', function() {
        it('should be requirable', function(done) {
            Ext.require('Ext.Promise', function() {
                done();
            });
        });

        it('should exist', function() {
            expect(Ext.Promise).toBeDefined();
        });

    });

    describe('#then', function() {
        var deferred, callback, spy;

        beforeEach(function() {
            deferred = Ext.create('Ext.Promise');
            callback = jasmine.createSpy('callback');
            spy = jasmine.createSpyObj('spy', ['after']);
            spy.callback = function() {
                this.after();
            };
        });

        it('should have a function then', function() {
            expect(deferred.promise.then).toBeDefined();
        });

        it('should call the callback, on resolve', function() {
            deferred.promise.then(callback);
            deferred.resolve();
            expect(callback).toHaveBeenCalled();
        });

        it('should call it with the scope', function() {
            deferred.promise.then(spy.callback, spy);
            deferred.resolve();
            expect(spy.after).toHaveBeenCalled();
        });

        it('should call then even if the promise was resolved before', function() {
            deferred.resolve();
            deferred.promise.then(callback);
            expect(callback).toHaveBeenCalled();
        });

        it('should call then when a async callback is finish', function(done) {
            setTimeout(function() {
                deferred.resolve();
                expect(callback).toHaveBeenCalled();
                done();
            }, 500);
            deferred.promise.then(callback);
        });
        
        it('should get the resolved value', function() {
            deferred.resolve('foo');
            deferred.promise.then(callback);
            expect(callback).toHaveBeenCalledWith('foo');
        });
    });

    describe('mixin', function() {
        it('should be possible to use it as a mixin', function(done) {
            var munchkin;
            Ext.define('munchkin', {
                mixins: ['Ext.Promise'],
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
