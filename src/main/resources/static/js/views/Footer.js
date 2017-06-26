define([
	'underscore',
	'backbone',
  'text!templates/footer/html/footer.html'
], function (_, Backbone, template) {
	'use strict';

	let Footer = Backbone.View.extend({

		el: '',
    tagName  : 'footer',
    className: 'main-footer',
	  template : _.template(template),
		events   : {
		},

		initialize: function () {
		},

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }
	});

	return Footer;
});