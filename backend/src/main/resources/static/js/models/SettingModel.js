define([
	'backbone'
], function (Backbone) {
	'use strict';

	var SettingModel = Backbone.Model.extend({

    urlRoot: '/api/v1/settings',

		defaults: {
			id: null,
      name: '',
      value: '',
      user: null,
      updated: null
		}
    
	});

	return SettingModel;
});