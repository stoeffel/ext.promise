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
