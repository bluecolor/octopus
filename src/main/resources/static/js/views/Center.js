define([
	'underscore',
	'backbone',
  'text!templates/center/html/center.html',
  'constants/Route',
  'views/user/UserView',
  'views/connection/ConnectionView',
  'views/scheduler/SchedulerView',
  'views/search/SearchView',
  'views/settings/SettingsView',
  'views/profile/ProfileView',
  'views/reports/ReportsView',
  'views/alert/AlertView'
], function (_, Backbone, template, Route, UserView, ConnectionView, SchedulerView, SearchView, SettingsView,ProfileView, ReportsView, AlertView) {
	'use strict';

    let Center = Backbone.View.extend({

		el: '',

    tagName   : 'content',
    className : 'js-center-view',
    template  : _.template(template),
		events    : {
		},

    initialize: function() {
      this.listen();
      this.config = {
        activeView : null
      };
    },

    listen: function(){
      let me = this;

      Backbone.on('route', function(o){
        console.log(o.route);
        switch(o.route){
          case Route.ALERTS:
            me.showAlertView(o);
            break;
          case Route.REPORTS:
            me.showReportsView(o);
            break;
          case Route.PROFILE:
          case Route.PROFILE_PASSWORD:
            me.showProfileView(o);
            break;
          case Route.SETTINGS_NO_MAIL:  
          case Route.SETTINGS_MAIL:
            me.showSettingsView(o);
            break;
          case Route.SEARCH:
            me.showSearchView(o);
            break;
          case Route.USERS:
          case Route.USERS_NEW:
          case Route.USERS_EDIT:
            me.showUserView(o);
            break;
          case Route.CONNECTIONS:
          case Route.CONNECTIONS_NEW:
          case Route.CONNECTIONS_EDIT:
          case Route.CONNECTIONS_IMPORT:
            me.showConnectionView(o); 
            break;
          case Route.SCHEDULER: 
          case Route.SCHEDULER_PLANS:
          case Route.SCHEDULER_PLANS_NEW:
          case Route.SCHEDULER_PLANS_EDIT:
          case Route.SCHEDULER_PLANS_IMPORT:
          case Route.SCHEDULER_SESSIONS:
          case Route.SCHEDULER_SESSIONS_EDIT:
          case Route.SCHEDULER_GROUPS:
          case Route.SCHEDULER_GROUPS_NEW:
          case Route.SCHEDULER_GROUPS_EDIT:
          case Route.SCHEDULER_GROUPS_IMPORT:
          case Route.SCHEDULER_TASKS:
          case Route.SCHEDULER_TASKS_NEW:
          case Route.SCHEDULER_TASKS_EDIT:
          case Route.SCHEDULER_TASKS_IMPORT:
          case Route.SCHEDULER_TASKS_DUPLICATE:
          case Route.SCHEDULER_PARAMETERS:
          case Route.SCHEDULER_PARAMETERS_NEW:
          case Route.SCHEDULER_PARAMETERS_EDIT:
          case Route.SCHEDULER_PARAMETERS_IMPORT:
          case Route.SCHEDULER_TASK_INSTANCES:
          case Route.SCHEDULER_TASK_INSTANCES_EDIT:
            me.showSchedulerView(o);  
            break;
        }          
      });  
    },

    showReportsView: function(o){
      this.hideActiveView();
      this.reportsView = new ReportsView();
      this.$el.append(this.reportsView.render().el);
      this.reportsView.show(o);
      this.config.activeView = this.reportsView;
    },

    showAlertView: function(o){
      this.hideActiveView();
      this.alertView = new AlertView();
      this.$el.append(this.alertView.render().el);
      this.alertView.show(o);
      this.config.activeView = this.alertView;
    },

    showProfileView: function(o){
      this.hideActiveView();
      this.profileView = new ProfileView();
      this.$el.append(this.profileView.render().el);
      this.profileView.show(o);
      this.config.activeView = this.profileView;
    },

    showSearchView: function(o){
      this.hideActiveView();
      this.searchView = new SearchView();
      this.$el.append(this.searchView.render(o.text).el);
      this.config.activeView = this.searchView;
    },

    showSettingsView: function(o){
      this.hideActiveView();
      this.settingsView = new SettingsView();
      this.$el.append(this.settingsView.render(o).el);
      this.config.activeView = this.settingsView;
    },

    showConnectionView: function(o){
      this.hideActiveView();
      this.connectionView = new ConnectionView(o);
      this.$el.append(this.connectionView.render().el);
      this.config.activeView = this.connectionView;
      this.connectionView.show(o);
    },

    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        for(let i in  this.config.activeView){
          delete this.config.activeView[i];
        } 
      }
    },

    showUserView: function(o){
      this.hideActiveView();
      if(_.isEmpty(this.userView)){
        this.userView = new UserView();
        this.$el.append(this.userView.render().el);
      }
      this.config.activeView = this.userView;
      this.userView.show(o);
    },

    showSchedulerView: function(o){
      this.hideActiveView();
      if(_.isEmpty(this.schedulerView)){
        this.schedulerView = new SchedulerView(o);
        this.$el.append(this.schedulerView.render().el);
      }
      this.config.activeView = this.schedulerView;
      this.schedulerView.show(o);
    },


		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return Center;
});
