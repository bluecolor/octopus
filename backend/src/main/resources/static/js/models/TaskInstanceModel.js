define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let TaskInstanceModel = Backbone.Model.extend({

    urlRoot: '/api/v1/scheduler/task-instances',

		defaults  : {
			id      : null,
      task    : null,
      status  : null,
      session : null,
      startDate:null,
      endDate : null,
      dependencies: null
		},

    dependencyStats: function(){
      return this.attributes.dependencies.length;
    }

    
	});

	return TaskInstanceModel;
});