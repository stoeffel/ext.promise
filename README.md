[![Build Status](https://travis-ci.org/stoeffel/ext.promise.svg)](https://travis-ci.org/stoeffel/ext.promise)

Ext.Promise
===========

This is a promise library for extjs. It's not promise/a+ compatible at the moment, because I want it to be more like a extjs component.

Usage
-----

Install it using bower.
`$ bower install ext.promise`

You need to add it to the classpath in your `app.json`.

```json
{
    "classpath": "${app.dir}/app,${app.dir}/bower_components/ext.promise",
}
```

Add the path for `Ext.Promise` to your `app.js`.
```js
Ext.application({
    name: 'ExampleApp',
    paths: {
        'Ext.promise': 'bower_components/ext.promise/lib'
    }
    /* ... */
});
```

If you need to access a return value instead of the returned Promise object, use returns():

```js
// msgBox has the instance of Ext.window.MessageBox, which is the original value of Ext.Msg.alert.
var msgBox = Ext.Msg.alert().then().returns();
```

To return your own value, use Ext.promise.Promise.returnValue:

```js
function create() {
    var deferred = Ext.create('Ext.promise.Deferred');
    deferred.promise.returnValue = 42;
    return deferred.promise;    
}

var promise = create();
var result = promise.then().returns(); // 42
```

### all

`all` waits for all promises to be resolved

```js
Ext.Promises.all([d1.promise, d2.promise]).then(function() {
    expect(d1.promise.state).toEqual(FULFILLED);
    expect(d2.promise.state).toEqual(FULFILLED);
    done();
});
```

### some

`some` waits for the first promise to be resolved

```js
Ext.Promises.all([d1.promise, d2.promise]).fail(function() {
    expect(d1.promise.state).toEqual(FULFILLED);
    done();
});
```


As a mixin
----------
```js
var munchkin;
Ext.define('munchkin', {
    mixins: ['Ext.promise.Deferred'],
    loot: function() {
        var deferred = this.deferred(),
            me = this;
        setTimeout(function() {
            me.resolve('a sword');
            // me.reject(new Error('ERROR'));
        }, 400);
        return deferred.promise;
    }
});
munchkin = Ext.create('munchkin');
munchkin.loot()
    .then(function(theLoot) {
        console.log(theLoot);
    })
    .fail(function(error) {
        console.error(error);
    })
    .done(function(value) {
        console.log('Done is allways invoked');
    });
});
```

Chains
------
`then` is chainable. It gets the last returned value;

```js
munchkin = Ext.create('munchkin');
munchkin.loot()
    .then(function(theLoot) {
        return 'Loot: ' + theLoot;
    })
    .then(function(theLoot) {
        console.log(theLoot); // -> Loot: a sword
    });
});
```

It is even possible to return a new promise in a `then`.

```js
munchkin = Ext.create('munchkin');
munchkin.loot()
    .then(function(theLoot) {
        var deferred = Ext.create('Ext.promise.Deferred');
        setTimeout(function() {
            deferred.resolve('a sword');
        }, 400);
        return deferred.promise;
    })
    .then(function(theLoot) {
        console.log(theLoot); // called when deferred is resolved
    });
});
```

Require
-------
You need to require the override class.

```js
Ext.require('Ext.promise.override.Require', function() {});
```

Now you can use `Ext.require` as promised.

```js
Ext.require(['App.foo.*', 'App.model.User'])
    .then(function() {
        console.log('loaded');
    });
```

Ajax
----
You need to require the override class.

```js
Ext.require('Ext.promise.override.Ajax', function() {});
```

Now request returns a promise.

```js
Ext.Ajax.request({
    url: 'test.json'
}).then(function(response) {
    console.log('SUCCESS');
}).fail(function(response) {
    console.log('ERROR');
});
```

Model
-----

You need to require the override class.

```js
Ext.require('Ext.promise.override.Model', function() {});
```

Loading a record.

```js
Ext.define('MyApp.User', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', type: 'int'},
        {name: 'name', type: 'string'}
    ]
});

MyApp.User.load(10)
    .then(function(record) {
        console.log('SUCCESS');
    }).fail(function() {
        console.log('ERROR');
    });
```

Saving a model

```js
var user = Ext.create('MyApp.User', {
    name: 'Stoeffel'
});
user.save()
    .then(this.onSave, this)
    .fail(this.onError, this)
```

Deleting a model

```js
user.erase()
    .then(this.onSave, this)
    .fail(this.onError, this)
```


Ext.Msg / Ext.MessageBox
------------------------

You need to require the override class:

```js
Ext.require('Ext.promise.override.Msg', function() {});
```

Show an alert message:

```js
Ext.Msg.alert('Error','Sorry, this should not happen')
    .then(function(btn){
        console.log(btn);
    });
```

Note that Ext.Msg.show / Ext.MessageBox.show does NOT return the original Ext.window.MessageBox object, instead you get a promise object.
