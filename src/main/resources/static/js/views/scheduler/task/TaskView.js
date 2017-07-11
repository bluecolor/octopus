define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task/html/task-view.html',
  'constants/Route',
  'collections/TaskStore',
  'views/scheduler/task/ZeroTask',
  'views/scheduler/task/Task',
  'views/scheduler/task/TaskTable',
  'views/shared/Import'
], function (_, Backbone, template, Route, TaskStore, ZeroTask, Task, TaskTable, Import) {
	'use strict';

	let TaskView = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-tasks-container',
		template  : _.template(template),
    events    : {
		},

		initialize: function() {
      this.config = {};
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

    showTaskTable: function(o){
      this.hideActiveView();
      console.log(TaskStore.models);
      if(_.isEmpty(TaskStore.models)){
        this.showZeroTask();
      }else{
        if(!this.taskTable){
          this.taskTable = new TaskTable(o.plan);
          this.$el.append(this.taskTable.render().el);
        }
        this.taskTable.$el.show();
        this.config.activeView = this.taskTable;  
      }
    },

    showZeroTask: function(){
      this.hideActiveView();
      if(!this.zeroTask){
        this.zeroTask = new ZeroTask();
        this.$el.append(this.zeroTask.render().el);
      }
      this.zeroTask.show();
      this.config.activeView = this.zeroTask;
    },

    showTask: function(id){
      this.hideActiveView();
      this.task = new Task(id);
      this.$el.append(this.task.render().el);
      this.config.activeView = this.task;
    },

    showImport: function(){
      this.hideActiveView();
      this.import = new Import();
      this.$el.append(this.import.render().el);
      this.config.activeView = this.import
    },

    show: function(o){
      switch(o.route){
        case Route.SCHEDULER_TASKS: this.showTaskTable(o); break;
        case Route.SCHEDULER_TASKS_NEW: this.showTask();  break;
        case Route.SCHEDULER_TASKS_EDIT: this.showTask(o.id); break;
        case Route.SCHEDULER_TASKS_DUPLICATE: this.showTask({id:o.id, mode:'DUPLICATE'}); break;
        case Route.SCHEDULER_TASKS_IMPORT: this.showImport(); break;
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    }

	});

	return TaskView;
});