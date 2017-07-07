define([
	'underscore',
  'backbone',
  'text!templates/connections/html/zero-connection.html',
  'ajax/User',
  'constants/index'
], function (_, Backbone, template, User, Constants) {
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
      this.initAuth();
      return this;
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.js-new-connection').removeClass('hidden');
      }else{
        this.$el.find('.js-new-connection').addClass('hidden');
      }
    }


	});

	return ZeroConnection;
});