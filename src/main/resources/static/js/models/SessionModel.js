define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let SessionModel = Backbone.Model.extend({

    urlRoot: '/api/v1/scheduler/sessions',

		defaults  : {
			id      : null,
      name    : null,
      status  : null,
      plan    : null,
      parallel: null,
      priority: null,
      active  : null,
      parallel: null,
      startDate:null,
      endDate : null,
      stats: null
		}
    
	});

	return SessionModel;
});