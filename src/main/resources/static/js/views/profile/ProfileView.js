define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/profile/Profile',
  'views/profile/ChangePassword',
], function (_, Backbone, Route, Profile, ChangePassword ) {
	'use strict';

	var ProfileView = Backbone.View.extend({

    tagName   : 'section',
    className : 'js-profile-view',
		events    : {
		},

		initialize: function() {
      this.config = {}
      return this;
		},

		render: function () { 	
      return this;
    },
    
    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        this.config.activeView = null;
      }
    },

    showProfile: function(){
      this.hideActiveView();
      this.profile = new Profile();
      this.$el.append(this.profile.render().el);
      this.config.activeView = this.profile;
    },

    changePassword: function(){
      this.hideActiveView();
      this.password = new ChangePassword();
      this.$el.append(this.password.render().el);
      this.config.activeView = this.password;
    },

    show: function(o){
      switch(o.route){
        case Route.PROFILE: 
          this.showProfile(); 
          break;
        case Route.PROFILE_PASSWORD:
          this.changePassword(); 
          break;
      }
      this.$el.show();
    }

	});

	return ProfileView;
});