define([
	'underscore',
  'backbone',
  'text!templates/settings/html/no-mail.html'
], function (_, Backbone, template) {
	'use strict';

	var NoMail = Backbone.View.extend({

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

	return NoMail;
});