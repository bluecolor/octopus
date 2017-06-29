define([
	'underscore',
  'backbone',
  'text!templates/alert/html/zero-alert.html'
], function (_, Backbone, template) {
	'use strict';

	var ZeroAlert = Backbone.View.extend({

		tagName   : 'div',
    className : '.no-connection',
		template  : _.template(template),
    events    : {
		},

		initialize: function() {
		},

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return ZeroAlert;
});