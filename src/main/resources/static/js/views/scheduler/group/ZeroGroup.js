define([
  'underscore',
  'backbone',
  'text!templates/scheduler/group/html/zero-group.html',
  'ajax/User',
  'constants/index'
], function (_, Backbone, template,User, Constants) {
	'use strict';

	let ZeroGroup = Backbone.View.extend({

		el: '',

    tagName   : 'div',
    className : 'hidden',
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
    
    hide : function(){
      this.$el.addClass('hidden');
    },
    show : function(){
      this.$el.removeClass('hidden');
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.js-new-group').removeClass('hidden');
      }else{
        this.$el.find('.js-new-group').addClass('hidden');
      }
    }  

	});

	return ZeroGroup;
});