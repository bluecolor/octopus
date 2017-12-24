define([
	'underscore',
	'backbone',
	'models/TechnologyModel'
], function (_, Backbone, TechnologyModel) {
	'use strict';

	let TechnologyStore = Backbone.Collection.extend({
    model     : TechnologyModel,
    url       : '/api/v1/technology',
		comparator: 'name'
	});

	return new TechnologyStore();
});