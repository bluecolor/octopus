define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let ConnectionModel = Backbone.Model.extend({

    urlRoot: '/api/v1/connections',

		defaults: {
			id: null,
      name: '',
      disabled: false,
      connectionType: 'JDBC',
      host: '',
      port: null,
      service: '',
      username: '',
      password: ''
		}
    
	});

	return ConnectionModel;
});
