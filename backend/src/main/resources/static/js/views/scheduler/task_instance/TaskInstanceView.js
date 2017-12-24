define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task_instance/html/task-instance-view.html',
  'constants/Route',
  'collections/TaskInstanceStore',
  'views/scheduler/task_instance/ZeroTaskInstance',
  'views/scheduler/task_instance/TaskInstanceTable',
  'views/scheduler/task_instance/TaskInstance',
  'plugins/Message'
  ], function (_, Backbone, template, Route, TaskInstanceStore, ZeroTaskInstance, TaskInstanceTable, TaskInstance, Message) {
	'use strict';

	let TaskInstanceView = Backbone.View.extend({

		
    tagName   : 'section',
    className : 'content js-sch-task-instance-view',
    template  : _.template(template),
		events    : {
		},

		initialize: function(session){
      this.config = {
        activeView: null,
        session: session
      };      
    },

    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        this.config.activeView = null;
      }
    },

    showTaskInstanceTable: function(o){      
      
      const me = this;
      this.hideActiveView();
      
      const success = (store, resp, opts) => {
        if(_.isEmpty(store.models)){
          me.showZeroTaskInstance();
        }else if(!me.taskInstanceTable){
          me.taskInstanceTable = new TaskInstanceTable(store.models[0].attributes.session.name);
          me.$el.append(me.taskInstanceTable.render().el); 
          me.config.hideActiveView = me.taskInstanceTable;
        }
      };

      const error = (store, resp, opts) => {
        Message.danger('Unable to get tasks for session');
      };


      TaskInstanceStore
        .setSession(o.session)
        .fetch({reset:true, data:{fetch:true, type:"get"},success:success, error:error});
      
      
    },

    showTaskInstance: function(o){
      this.hideActiveView();
      this.taskInstance = new TaskInstance(o.id);
      this.$el.append(this.taskInstance.render().el);
      this.config.activeView = this.taskInstance;
    },


    showZeroTaskInstance: function(){
      console.log(';showZeroTaskInstance')
    },

    show: function(o){
      switch(o.route){
        case Route.SCHEDULER_TASK_INSTANCES: 
          this.showTaskInstanceTable(o);
          break;
        case Route.SCHEDULER_TASK_INSTANCES_EDIT:
          this.showTaskInstance(o);
          break;
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    },

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return TaskInstanceView;
});