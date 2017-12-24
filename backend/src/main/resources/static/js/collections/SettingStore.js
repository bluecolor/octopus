define([
	'underscore',
	'backbone',
	'models/SettingModel'
], function (_, Backbone, SettingModel) {
	'use strict';

	let SettingStore = Backbone.Collection.extend({
    model     : SettingModel,
    url       : '/api/v1/settings',
		comparator: 'name'
  });

	return new SettingStore();
});