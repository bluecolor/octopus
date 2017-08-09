define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/user/UserTable',
  'views/user/User'
], function (_, Backbone, Route, UserTable, User ) {
	'use strict';

	var UserView = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-user-view',
		events    : {
		},

		initialize: function() {
		},

		render: function () { 	
      return this;
    },

    showUser: function(id){
      this.hideUserTable();
      this.user = new User(id);
      this.$el.append(this.user.render().el);
    },

    hideUser: function(){
      if(this.user){
        this.user.$el.remove();
        this.user = null;
      }
    },

    showUserTable: function(){
      this.hideUser();
      this.userTable = new UserTable();
      this.$el.append(this.userTable.render().el);
    },

    hideUserTable: function(){
      if(this.userTable){
        this.userTable.$el.remove();
        this.userTable = null;
      }
      
    },

    show: function(o){
      switch(o.route){
        case Route.USERS: 
          this.showUserTable(); 
          break;
        case Route.USERS_NEW: 
        case Route.USERS_EDIT: 
          this.showUser(o.id); 
          break;  
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    }

	});

	return UserView;
});