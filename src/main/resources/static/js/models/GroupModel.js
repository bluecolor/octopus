define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let GroupModel = Backbone.Model.extend({

    urlRoot: '/api/v1/scheduler/groups',

		defaults: {
			id: null,
      name: '',
      connection: null,
      parallel: 20,
      color: '#FFFFFF',
      tasks: null,
      description: null
		}
    
	});

	return GroupModel;
});