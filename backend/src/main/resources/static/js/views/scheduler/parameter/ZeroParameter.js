define([
	'underscore',
  'backbone',
  'text!templates/scheduler/parameter/html/zero-parameter.html',
  'ajax/User',
  'constants/index'
], function (_, Backbone, template, User, Constants) {
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
      this.initAuth();
      return this;
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.js-new-parameter').removeClass('hidden');
      }else{
        this.$el.find('.js-new-parameter').addClass('hidden');
      }
    }

	});

	return ZeroParameter;
});