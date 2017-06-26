define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	let SearchModel = Backbone.Model.extend({
		defaults: {
			name: '',
      resultType: '',
      result: null
		}
	});

	return SearchModel;
});