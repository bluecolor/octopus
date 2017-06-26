define([
	'backbone',
  'constants/Route'
], function (Backbone, RouteConstants) {
	'use strict';

	let AppRouter = Backbone.Router.extend({
		routes: {
      "": ()=>{
        Backbone.trigger("route:home");
      },
      "search": ()=> {
        const route = RouteConstants.SEARCH;
        Backbone.trigger("route", {route:route});
      },
      "users" : ()=>{
        const route= RouteConstants.USERS;
        Backbone.trigger("route",{route: route});
      },
      "users/new" : ()=>{
        const route= RouteConstants.USERS_NEW;
        Backbone.trigger("route",{route: route});
      },
      "users/:id" : (id)=>{
        const route= RouteConstants.USERS_NEW;
        Backbone.trigger("route",{route: route, id: id});
      },
      "connections" : ()=>{
        const route= RouteConstants.CONNECTIONS;
        Backbone.trigger("route",{route: route});
      }, 
      "connections/new" : ()=>{
        const route = RouteConstants.CONNECTIONS_NEW;
        Backbone.trigger("route",{route: route});
      },
      "connections/import" : ()=>{
        const route = RouteConstants.CONNECTIONS_IMPORT;
        Backbone.trigger("route",{route: route});
      },
      "connections/:id" : (id)=>{
        const route= RouteConstants.CONNECTIONS_EDIT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "scheduler" : ()=>{
        const route= RouteConstants.SCHEDULER;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/plans" : ()=>{
        const route= RouteConstants.SCHEDULER_PLANS;
        Backbone.trigger("route", {route: route});
      }, 
      "scheduler/plans/new" : ()=>{
        const route= RouteConstants.SCHEDULER_PLANS_NEW;  
        Backbone.trigger("route", {route: route});
      },
      "scheduler/plans/import" : (id)=>{
        const route= RouteConstants.SCHEDULER_PLANS_IMPORT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "scheduler/plans/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_PLANS_EDIT;  
        Backbone.trigger("route", {route: route, id:id});
      },
      "scheduler/sessions" : ()=>{
        const route= RouteConstants.SCHEDULER_SESSIONS;  
        Backbone.trigger("route", {route: route});
      },
      "scheduler/sessions/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_SESSIONS_EDIT;  
        Backbone.trigger("route", {route: route, id:id});
      },
      "scheduler/task-instances?session=:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_TASK_INSTANCES;  
        Backbone.trigger("route", {route: route, session:id});
      },
      "scheduler/task-instances/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_TASK_INSTANCES_EDIT;  
        Backbone.trigger("route", {route: route, id:id});
      },
      'scheduler/tasks?plan=:id' : (plan)=>{
        const route= RouteConstants.SCHEDULER_TASKS;
        Backbone.trigger("route", {route: route, plan:plan});
      },
      'scheduler/tasks' : ()=>{
        const route= RouteConstants.SCHEDULER_TASKS;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/tasks/new" : ()=>{
        const route= RouteConstants.SCHEDULER_TASKS_NEW;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/tasks/new/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_TASKS_DUPLICATE;
        Backbone.trigger("route", {route: route, id:id});
      },
      "scheduler/tasks/import" : (id)=>{
        const route= RouteConstants.SCHEDULER_TASKS_IMPORT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "scheduler/tasks/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_TASKS_EDIT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "scheduler/groups" : ()=>{
        const route= RouteConstants.SCHEDULER_GROUPS;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/groups/new" : ()=>{
        const route= RouteConstants.SCHEDULER_GROUPS_NEW;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/groups/import" : (id)=>{
        const route= RouteConstants.SCHEDULER_GROUPS_IMPORT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "scheduler/groups/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_GROUPS_EDIT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "scheduler/parameters" : ()=>{
        const route= RouteConstants.SCHEDULER_PARAMETERS;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/parameters/new" : ()=>{
        const route= RouteConstants.SCHEDULER_PARAMETERS_NEW;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/parameters/import" : ()=>{
        const route= RouteConstants.SCHEDULER_PARAMETERS_IMPORT;
        Backbone.trigger("route", {route: route});
      },
      "scheduler/parameters/:id" : (id)=>{
        const route= RouteConstants.SCHEDULER_PARAMETERS_EDIT;
        Backbone.trigger("route", {route: route, id: id});
      },
      "settings/mail" : ()=>{
        const route= RouteConstants.SETTINGS_MAIL;
        Backbone.trigger("route", {route: route});
      },
      "profile": ()=> {
        const route= RouteConstants.PROFILE;
        Backbone.trigger("route", {route: route});
      },
      "profile/password": ()=> {
        const route= RouteConstants.PROFILE_PASSWORD;
        Backbone.trigger("route", {route: route});
      },
      "reports": ()=> {
        const route= RouteConstants.REPORTS;
        Backbone.trigger("route", {route: route});
      },
      "alerts": ()=> {
        const route= RouteConstants.ALERTS;
        Backbone.trigger("route", {route: route});
      }
    },

	});

	return AppRouter;
});
