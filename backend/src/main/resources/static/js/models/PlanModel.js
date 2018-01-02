define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let PlanModel = Backbone.Model.extend({

    urlRoot: '/api/v1/scheduler/plans',

		defaults: {
			id  : null,
      name: '',
      schedule: '',
      description: '',
      connection: null,
      parallel: 20
		}
    
	});

	return PlanModel;
});