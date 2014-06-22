/**
 * A promise is eventually resolved or rejected after an asynchronous function.
 * @autor Christoph Hermann
 */
Ext.define('Ext.promise.Promise', function() {

    return {
        statics: {
            STATE: {
                PENDING: 0,
                FULFILLED: 1,
                REJECTED: 2
            }
        },

        config: {
            state: null,
            resolvedValue: null,
            rejectedError: null,
        },

        /**
         * initializes the state of a promise.
         * A promise is always PENDING on creation.
         */
        constructor: function(config) {
            this.state = this.statics().STATE.PENDING;
        },

        /**
         * Then defines what should happen, when the promise is resolved.
         * @param {Function} onFulfilled The function called, when the promise is resolved.
         * @param {Function} [onRejected] The function called, when the promise is rejected.
         * @param {Object} [scope] The scope of the called function.
         * @return {Ext.promise.Promise} A new promise.
         */
        then: function(onFulfilled, onRejected, scope) {
            this.onRejected = this.onFulfilled || this.createCallback(Ext.emptyFn, this);
            if (Ext.isFunction(onRejected)) {
                this.onRejected = this.createCallback(onRejected, scope);
            } else if (Ext.isObject(onRejected)) {
                scope = scope || onRejected;
            }
            this.onFulfilled = this.createCallback(onFulfilled, scope);

            this.checkNotPending();
            return this.next();
        },

        /**
         * Resolve is called by Ext.promise.Deferred when the asynchronous function is completed
         * This function calls a given onFulfilled function.
         * @param {} [resolvedValues] One or more resolved values.
         */
        resolve: function() {
            this.resolvedValue = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.FULFILLED;
                if (this.onFulfilled) {
                    this.onFulfilled(this.resolvedValue);
                }
            }
        },

        /**
         * Then defines what should happen, when the promise is rejected.
         * @param {Function} onRejected The function called, when the promise is rejected.
         * @param {Object} [scope] The scope of the called function.
         * @return {Ext.promise.Promise} A new promise.
         */
        fail: function(onRejected, scope) {
            this.onFulfilled = this.onFulfilled || this.createCallback(Ext.emptyFn, scope);
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
