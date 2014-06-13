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
        var promise, callback, spy;

        beforeEach(function() {
            promise = Ext.create('Ext.Promise');
            callback = jasmine.createSpy('callback');
            spy = jasmine.createSpyObj('spy', ['after']);
            spy.callback = function() {
                this.after();
            };
        });

        it('should have a function then', function() {
            expect(promise.then).toBeDefined();
        });

        it('should call the callback, on resolve', function() {
            promise.then(callback);
            promise.resolve();
            expect(callback).toHaveBeenCalled();
        });

        it('should call it with the scope', function() {
            promise.then(spy.callback, spy);
            promise.resolve();
            expect(spy.after).toHaveBeenCalled();
        });

        it('should call then even if the promise was resolved before', function() {
            promise.resolve();
            promise.then(callback);
            expect(callback).toHaveBeenCalled();
        });

        it('should call then when a async callback is finish', function(done) {
            setTimeout(function() {
                promise.resolve();
                expect(callback).toHaveBeenCalled();
                done();
            }, 500);
            promise.then(callback);
        });
        
        it('should get the resolved value', function() {
            promise.resolve('foo');
            promise.then(callback);
            expect(callback).toHaveBeenCalledWith('foo');
        });
    });

    describe('mixin', function() {
        it('should be possible to use it as a mixin', function(done) {
            var munchkin;
            Ext.define('munchkin', {
                mixins: ['Ext.Promise'],
                loot: function() {
                    var me = this;
                    setTimeout(function() {
                        me.resolve('a sword');
                    }, 400);
                    return this;
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
