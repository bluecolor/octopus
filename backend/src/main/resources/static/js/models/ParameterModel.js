define([
	'backbone'
], function (Backbone) {
	'use strict';

	var ParameterModel = Backbone.Model.extend({

    urlRoot: '/api/v1/scheduler/parameters',

		defaults: {
			id: null,
      name: '',
      value: '',
      description: ''
		}
    
	});

	return ParameterModel;
});