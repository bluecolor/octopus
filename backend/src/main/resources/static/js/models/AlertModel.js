define([
	'backbone'
], function (Backbone) {
	'use strict';

	var AlertModel = Backbone.Model.extend({

    urlRoot: '/api/v1/alerts',

		defaults: {
			tp : '',
      msg: '',
      obj: null
		}
    
	});

	return AlertModel;
});