/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Technology = Backbone.Model.extend({

    urlRoot: '/api/v1/technology',

		defaults: {
			id: null,
      name: '',
      description: ''
		}
    
	});

	return Technology;
});