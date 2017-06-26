define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let TaskModel = Backbone.Model.extend({

    urlRoot: '/api/v1/scheduler/tasks',

		defaults: {
			id  : null,
      name: '',
      active: true,
      plan: null,
      connection: null,
      priority: 2,
      retryCount: 1,
      groups: null,
      technology: null,
      script: null,
      description: '',
      bookmarked: false
    }
    
	});

	return TaskModel;
});