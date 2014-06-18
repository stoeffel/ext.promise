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
        console.log(theLoot);
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
