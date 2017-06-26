define([
	'underscore',
  'backbone',
  'text!templates/scheduler/plan/html/zero-plan.html'
], function (_, Backbone, template) {
	'use strict';

	var ZeroPlan = Backbone.View.extend({

		tagName   : 'div',
    className : 'empty-plans',
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

	return ZeroPlan;
});