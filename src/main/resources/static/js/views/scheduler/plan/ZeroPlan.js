define([
	'underscore',
  'backbone',
  'text!templates/scheduler/plan/html/zero-plan.html',
  'ajax/User',
  'constants/index'
], function (_, Backbone, template, User, Constants) {
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
      this.initAuth();
      return this;
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.js-new-plan').removeClass('hidden');
      }else{
        this.$el.find('.js-new-plan').addClass('hidden');
      }
    }  

	});

	return ZeroPlan;
});