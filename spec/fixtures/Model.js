Ext.define('Fixtures.Model', {
    extend: 'Ext.data.Model',

    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }],

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'records'
        },
        api: {
            create: './spec/fixtures/data.json',
            read: './spec/fixtures/data.json',
            update: './spec/fixtures/data.json',
            destroy: './spec/fixtures/data.json'
        }
    },
    statics: {
        load: function(id, options, session) {
            if (id === 2) {
                this.setProxy(Ext.create('Ext.data.proxy.Ajax', {
                    api: {
                        create: './spec/fixtures/error.json',
                        read: './spec/fixtures/error.json',
                        update: './spec/fixtures/error.json',
                        destroy: './spec/fixtures/error.json'
                    }
                }));
            }
            return this.callParent([id, options, session]);
        }
    }
});
