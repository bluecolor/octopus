define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let UserModel = Backbone.Model.extend({

    urlRoot: '/api/v1/users',

		defaults: {
			id: null,
      name: '',
      username: '',
      password: '',
      system  : false,
      role    : 'GUEST',
      locked  : false
		}
    
	});

	return UserModel;
});