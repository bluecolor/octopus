define([
	'underscore',
  'backbone',
  'text!templates/scheduler/html/scheduler-view.html',
  'constants/Route',
  'views/scheduler/SchedulerMonitor',
  'views/scheduler/task/TaskView',
  'views/scheduler/plan/PlanView',
  'views/scheduler/group/GroupView',
  'views/scheduler/parameter/ParameterView',
  'views/scheduler/session/SessionView',
  'views/scheduler/task_instance/TaskInstanceView'
], function (_, Backbone, template, Route, Monitor, TaskView, PlanView, GroupView, ParameterView, SessionView, TaskInstanceView) {
	'use strict';

	let SchedulerView = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-scheduler-view',
		template  : _.template(template),
    events    : {
		},

		initialize: function () {
      this.config = {
        activeView: null
      };
      return this;
    },

		render: function () { 	
      this.$el.html(this.template());
      return this;
    },

    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        this.config.activeView = null;
      }
    },

    showParameterView: function(o){
      this.hideActiveView();
      if(!this.parameterView){
        this.parameterView = new ParameterView();
        this.$el.append(this.parameterView.render().el);
      }
      this.config.activeView = this.parameterView;
      this.parameterView.show(o);
    },

    showMonitor: function(){
      this.hideActiveView();
      if(!this.monitor){
        this.monitor = new Monitor();
        $(this.el).append(this.monitor.render().el);
      }
      this.config.activeView = this.monitor;
      this.monitor.$el.show();
    },

    showTaskView: function(o){
      this.hideActiveView();
      if(!this.taskView){
        this.taskView = new TaskView();
        this.$el.append(this.taskView.render().el);
      }
      this.config.activeView = this.taskView;
      this.taskView.show(o);
    },

    showPlanView: function(o){
      this.hideActiveView();
      if(!this.planView){
        this.planView = new PlanView();
        this.$el.append(this.planView.render().el);
      }
      this.config.activeView = this.planView;
      this.planView.show(o);
    },

    showGroupView: function(o){
      this.hideActiveView();
      if(!this.groupView){
        this.groupView = new GroupView();
        this.$el.append(this.groupView.render().el);
      }
      this.config.activeView = this.groupView;
      this.groupView.show(o);
    },

    showSessionView: function(o){
      this.hideActiveView();
      if(!this.sessionView){
        this.sessionView = new SessionView();
        this.$el.append(this.sessionView.render().el);
      }
      this.config.activeView = this.sessionView;
      this.sessionView.show(o);
    },

    showTaskInstanceView: function(o){
      this.hideActiveView();
      if(!this.taskInstanceView){
        this.taskInstanceView = new TaskInstanceView(o.session);
        this.$el.append(this.taskInstanceView.render().el);
      }
      this.config.activeView = this.taskInstanceView;
      this.taskInstanceView.show(o);
    },

    show: function(o){
      switch(o.route){
        case Route.SCHEDULER: 
          this.showMonitor(o); 
          break;
        case Route.SCHEDULER_PLANS: 
        case Route.SCHEDULER_PLANS_NEW:
        case Route.SCHEDULER_PLANS_EDIT:
        case Route.SCHEDULER_PLANS_IMPORT:
          this.showPlanView(o);  
          break;
        case Route.SCHEDULER_TASK_INSTANCES:
        case Route.SCHEDULER_TASK_INSTANCES_EDIT:
          this.showTaskInstanceView(o);
          break;
        case Route.SCHEDULER_TASKS: 
        case Route.SCHEDULER_TASKS_NEW:
        case Route.SCHEDULER_TASKS_EDIT:
        case Route.SCHEDULER_TASKS_IMPORT:
        case Route.SCHEDULER_TASKS_DUPLICATE:
          this.showTaskView(o);  
          break;
        case Route.SCHEDULER_GROUPS:
        case Route.SCHEDULER_GROUPS_NEW: 
        case Route.SCHEDULER_GROUPS_EDIT:
        case Route.SCHEDULER_GROUPS_IMPORT:
          this.showGroupView(o); 
          break;
        case Route.SCHEDULER_PARAMETERS:
        case Route.SCHEDULER_PARAMETERS_NEW:
        case Route.SCHEDULER_PARAMETERS_EDIT:
        case Route.SCHEDULER_PARAMETERS_IMPORT:
          this.showParameterView(o);
          break;
        case Route.SCHEDULER_SESSIONS:
        case Route.SCHEDULER_SESSIONS_EDIT:  
          this.showSessionView(o);
          break;
      }

      this.$el.show();
    }


	});

	return SchedulerView;
});