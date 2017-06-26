define([
	'underscore',
  'backbone',
  'text!templates/scheduler/parameter/html/zero-parameter.html'
], function (_, Backbone, template) {
	'use strict';

	var ZeroParameter = Backbone.View.extend({

		tagName   : 'div',
    className : 'js-zero-parameter',
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

	return ZeroParameter;
});