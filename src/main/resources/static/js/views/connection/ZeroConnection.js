define([
	'underscore',
  'backbone',
  'text!templates/connections/html/zero-connection.html'
], function (_, Backbone, template) {
	'use strict';

	var ZeroConnection = Backbone.View.extend({

    className : 'empty-connections',
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

	return ZeroConnection;
});