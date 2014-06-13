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
        'Ext.Promise': 'bower_components/ext.promise'
    }
    /* ... */
});
```

As a mixin
----------
```js
var munchkin;
Ext.define('munchkin', {
    mixins: ['Ext.Promise'],
    loot: function() {
        var me = this;
        setTimeout(function() {
            me.resolve('a sword');
        }, 400);
        return this; // return this
    }
});
munchkin = Ext.create('munchkin');
munchkin.loot()
    .then(function(theLoot) {
        expect(theLoot).toEqual('a sword');
        done();
    });
});
```
