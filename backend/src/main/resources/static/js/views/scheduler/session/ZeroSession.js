define([
	'underscore',
  'backbone',
  'text!templates/scheduler/session/html/zero-session.html'
], function (_, Backbone, template) {
	'use strict';

	var ZeroSession = Backbone.View.extend({

		tagName   : 'div',
    className : '.no-connection',
		template  : _.template(template),
    events    : {
      'click .js-cancel-btn': 'onClose'
		},

		initialize: function() {
      return this;
    },

    onClose: function(){
      window.history.back();
    },

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return ZeroSession;
});