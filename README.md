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
