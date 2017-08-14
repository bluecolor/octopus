define([
	'underscore',
	'backbone',
  'text!templates/header/html/header.html',
  'ajax/User'
], function (_, Backbone, template, User) {
	'use strict';

	let Header = Backbone.View.extend({

		template: _.template(template),

		events: {
		},

		initialize: function () {
		},

    fixBell: function(){
      const me = this;
      setTimeout(function(){
        const o = User.me.opts();
        if(o.ui.bellSwing){
          me.$el.find('.js-alert-btn i.fa-bell').addClass('animated infinite swing');
        }else{
          me.$el.find('.js-alert-btn i.fa-bell').removeClass('animated infinite swing');
        }
      },500);
    },

		render: function () { 	
      const me = this;
      me.$el.html(this.template());
      me.fixBell();
      return me;
    }

	});

	return Header;
});