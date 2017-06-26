define([
	'underscore',
	'backbone',
  'text!templates/header/html/header.html'
], function (_, Backbone, template) {
	'use strict';

	let Header = Backbone.View.extend({

		el: 'header',

		template: _.template(template),

		events: {
		},

		initialize: function () {
		},

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return Header;
});