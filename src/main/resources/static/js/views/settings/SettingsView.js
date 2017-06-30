define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/settings/Mail',
  'views/settings/NoMail'
], function (_, Backbone, Route, Mail, NoMail) {
	'use strict';

	let SettingsView = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-parameter-view',
    
    events    : {
		},

		initialize: function () {
      this.config = {}
      return this;
    },

		render: function (o) { 	
      this.show(o)
      return this;
    },
    
    showMail: function(){
      this.hideActiveView();
      if(!this.mail){
        this.mail = new Mail();
        $(this.el).append(this.mail.render().el);
      }
      this.config.activeView = this.mail;
      this.mail.$el.show();
    },

    showNoMail: function(){
      this.hideActiveView();
      this.noMail = new NoMail();
      this.$el.append(this.noMail.render().el);
      this.activeView = this.noMail 
    },

    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        this.config.activeView = null;
      }
    },

    show: function(o){
      switch(o.route){
        case Route.SETTINGS_MAIL:
          this.showMail(o);
          break;
        case Route.SETTINGS_NO_MAIL:
          this.showNoMail(o);
          break;
      }
      this.$el.show();
    },


	});

	return SettingsView;
});