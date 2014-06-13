Ext.Promise
===========


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
