Ext.define('Ext.promise.Promise', function() {

    return {
        statics: {
            STATE: {
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },
        config: { //TODO remove unused stuff
            state: null,
            resolvedValue: null,
            rejectedError: null,
        },

        constructor: function(config) {
            this.state = this.statics().STATE.PENDING;
        },

        then: function(onFulfilled, onRejected, scope) {
            this.onRejected = this.createCallback(Ext.emptyFn, this);
            if (Ext.isFunction(onRejected)) {
                this.onRejected = this.createCallback(onRejected, scope);
            } else if (Ext.isObject(onRejected)) {
                scope = scope || onRejected;
            }
            this.onFulfilled = this.createCallback(onFulfilled, scope);

            this.checkNotPending();
            return this.next();
        },

        resolve: function() {
            this.resolvedValue = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.FULFILLED;
                if (this.onFulfilled) {
                    this.onFulfilled(this.resolvedValue);
                }
            }
        },

        fail: function(onRejected, scope) {
            this.onFulfilled = this.createCallback(Ext.emptyFn, scope);
            this.onRejected = this.createCallback(onRejected, scope);

            this.checkNotPending();
            return this.next();
        },

        reject: function() {
            this.rejectedError = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.REJECTED;
                if (this.onRejected) {
                    this.onRejected(this.rejectedError);
                }
            }
        },

        privates: {
            createCallback: function(callback, scope) {
                var me = this,
                    statics = me.statics();
                scope = scope || me;
                return function(args) {
                    callback.apply(scope, args);
                    if (me.state === statics.STATE.FULFILLED) {
                        me.next().resolve.apply(me.next(), me.resolvedValue);
                    }
                    if (me.state === statics.STATE.REJECTED) {
                        me.next().reject.apply(me.next(), me.rejectedError);
                    }
                };
            },

            next: function() {
                if (!this.nextPromise) {
                    this.nextPromise = Ext.create('Ext.promise.Promise');
                }
                return this.nextPromise;
            },

            checkNotPending: function() {
                if (this.state === this.statics().STATE.FULFILLED) {
                    this.state = this.statics().STATE.PENDING;
                    this.resolve.apply(this, this.resolvedValue);
                }
                if (this.state === this.statics().STATE.REJECTED) {
                    this.state = this.statics().STATE.PENDING;
                    this.reject.apply(this, this.rejectedError);
                }
            }
        }
    };
});
