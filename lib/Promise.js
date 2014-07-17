/**
 * A promise is eventually resolved or rejected after an asynchronous function.
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
            returnValue: null
        },

        /**
         * initializes the state of a promise.
         * A promise is always PENDING on creation.
         */
        constructor: function(config) {
            this.state = this.statics().STATE.PENDING;
        },

        /**
         * Done defines what should happen, when the promise is resolved or rejected.
         * @param {Function} [onDone] The function called, when the promise is resolved or rejected.
         * @param {Object} [scope] The scope of the called function.
         * @return {Ext.promise.Promise} A new promise.
         */
        done: function(onDone, scope) {
            this.onDone = this.createCallback(onDone, scope);

            this.checkNotPending();
            return this.next();
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
         * The function takes one or more arguments, which are passed to the onFulfilled function.
         */
        resolve: function() {
            this.resolvedValue = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.FULFILLED;
                if (this.onFulfilled) {
                    this.onFulfilled(this.resolvedValue);
                }
                if (this.onDone) {
                    this.onDone(this.resolvedValue);
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

        /**
         * Reject is called by Ext.promise.Deferred when the asynchronous function fails
         * This function calls a given onRejected function.
         * The function takes one or more arguments, which are passed to the onRejected function.
         */
        reject: function() {
            this.rejectedError = arguments;
            if (this.state === this.statics().STATE.PENDING) {
                this.state = this.statics().STATE.REJECTED;
                if (this.onRejected) {
                    this.onRejected(this.rejectedError);
                }
                if (this.onDone) {
                    this.onDone(this.rejectedError);
                }
            }
        },

        /**
         * Returns the value of Promise.returnValue. Can be used to return an original / wrapped
         * function return value.
         *
         * @return {mixed} The original return value
         */
        returns: function() {
            return this.returnValue || null;
        },

        /**
         * Checks if the given object is an instance of Ext.promise.Promise
         * @param  {Object}  instance The object to test
         * @return {Boolean}          true if instance is Ext.promise.Promise, false otherwise
         */
        isPromise: function(instance) {
            return instance instanceof Ext.promise.Promise;
        },

        /**
         * creates a new callback for onFulfilled/onRejected.
         * After the callback it resolves/rejects the next promise.
         * @param {Function} callback The function to wrap.
         * @param {Object} scope The functions scope
         * @return {Function} The callback.
         */
        createCallback: function(callback, scope) {
            var me = this,
                statics = me.statics();
            scope = scope || me;
            return function(args) {
                var returnValue = callback.apply(scope, args);
                if (me.state === statics.STATE.FULFILLED) {
                    if (Ext.isDefined(returnValue)) {
                        me.resolvedValue = [returnValue];
                    }
                    if (me.isPromise(returnValue)) {
                        me.handleReturnedPromise(returnValue);
                    } else {
                        me.next().resolve.apply(me.next(), me.resolvedValue);
                    }
                }
                if (me.state === statics.STATE.REJECTED) {
                    if (Ext.isDefined(returnValue)) {
                        me.rejectedError = [returnValue];
                    }
                    if (me.isPromise(returnValue)) {
                        me.handleReturnedPromise(returnValue);
                    } else {
                        me.next().reject.apply(me.next(), me.rejectedError);
                    }
                }
            };
        },

        /**
         * Invokes a returned (chained) Promise
         * @param  {Ext.promise.Promise} promise The promise to execute chained
         */
        handleReturnedPromise: function(promise) {
            var me = this;
            promise.then(function() {
                me.next().resolve.apply(me.next(), arguments);
            }).fail(function() {
                me.next().reject.apply(me.next(), arguments);
            });
        },

        /**
         * returns the next Ext.promise.Promise
         * @return {Ext.promise.Promise} A new promise.
         */
        next: function() {
            if (!this.nextPromise) {
                this.nextPromise = Ext.create('Ext.promise.Promise');
            }
            this.nextPromise.returnValue = this.returnValue;
            return this.nextPromise;
        },

        /**
         * Checks if the promise is already fulfilled or rejected.
         */
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
    };
});
