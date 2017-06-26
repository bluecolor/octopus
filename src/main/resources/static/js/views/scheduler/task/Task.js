define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task/html/task.html',
  'plugins/Message',
  'models/TaskModel',
  'collections/TaskStore',
  'views/scheduler/task/TaskGeneral',
  'views/scheduler/task/TaskScript',
  'views/scheduler/task/TaskGroups',
  'views/scheduler/task/TaskOwners',  
  'views/scheduler/task/TaskDependencies',
], function (
  _, Backbone, template, Message, TaskModel, TaskStore, TaskGeneral, 
  TaskScript, TaskGroups, TaskOwners, TaskDependencies) {
	
  'use strict';

	var Task = Backbone.View.extend({

    tagName   : 'section',
    className : 'js-scheduler-task-view',
		template  : _.template(template),
    events    : {
      "click .js-save-btn": "onSave",
      "click .js-cancel-btn": "onCancel",
      "click .js-fav": "validate",
      "change select, input.form-control.slider, input[id^='radio-active']" :"validate",
      "input input, .script-editor textarea": "validate"
    },

		initialize: function (o) {
      this.general = new TaskGeneral();
      this.script  = new TaskScript();
      this.groups  = new TaskGroups();
      this.owners  = new TaskOwners();
      this.dependencies = new TaskDependencies();
      
      if(_.isObject(o)){
        this.modelId = o.id;
        this.mode = o.mode;
      }else{
        this.modelId = o;
      }
    },

    setValues: function(id){
      const me = this;
      this.model = TaskStore.get(id) || new TaskModel();  
      const attr = this.model.attributes;

      this.general.$el.find('input[name="name"]').val(attr.name);
      this.general.$el.find('select[name="plan"]').val(attr.plan?attr.plan.id:null);
      this.general.$el.find('select[name="connection"]').val(attr.connection?attr.connection.id:null);
      setTimeout(function(){
        me.general.priority.slider('setValue', attr.priority);
      },1);
      this.general.$el.find('input[name="retryCount"]').val(attr.retryCount);
      this.general.$el.find('#radio-active-1').prop('checked', attr.active);
      this.general.$el.find('#radio-active-2').prop('checked',!attr.active);
      this.general.$el.find('textarea[name="description"]').val(attr.description);
      this.groups.setValue(_.pluck(attr.groups,'id'),attr.primaryGroup?attr.primaryGroup.id:null);
      this.dependencies.setValue(_.pluck(attr.dependencies,'id'));
      this.owners.setValue(_.pluck(attr.owners,'id'),attr.primaryOwner?attr.primaryOwner.id:null);
      setTimeout(function(){
        const technology = attr.technology?attr.technology.id:null;
        me.script.setValue(attr.script, technology);
      },10);
      
    },

		render: function () { 	
      const me = this;
      this.$el.html(this.template());
      this.$el.find('#task-general').append(this.general.render(this.model).el);
      this.$el.find('#task-script').append(this.script.render().el);
      this.$el.find('#task-groups').append(this.groups.render().el);
      this.$el.find('#task-owners').append(this.owners.render().el);
      this.$el.find('#task-dependencies').append(this.dependencies.render().el);
      me.setValues(me.modelId);
      if(!me.modelId){
        this.owners.addCurrentUser();
      }
      if(this.mode == 'DUPLICATE'){
        this.modelId = null;
        this.model = new TaskModel();
      }

      return this;
    },

    onCancel: function(){
      window.history.back();
    },

    onSave: function(){
      const me = this,
            task  = this.getProps();

      const loading = Ladda.create( document.querySelector('.js-scheduler-task-view .js-save-btn') );
      loading.start();

      const onSuccess = function(){
        if(!me.modelId){
          TaskStore.add(me.model);
        }
        Message.notifySuccess('Task saved!');
        window.history.back();
      },
      onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      this.model.save(task,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });
    },

    validate: function(){

      let isValid = true;
      const props = this.getProps();
      
      isValid = !( 
        _.isEmpty(props.name)   ||  
        _.isNaN(props.plan)     ||
        props.priority < 1      || 
        props.priority > 4      ||
        _.isEmpty(props.script) 
      );

      this.enableActionButtons(isValid);
    },

    enableActionButtons: function(enable){
      if(enable){
        this.$el.find('.js-save-btn').removeClass('disabled');
      }else{
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

    getProps: function(){
      let props = {},
          $task = this.$el;

      props.id = this.mode == 'DUPLICATE'? null : this.modelId   

      props.name = $task.find('.js-scheduler-task-general-view input[name="name"]').val();
      props.plan = parseInt($task.find('.js-scheduler-task-general-view select[name="plan"]').val()); 
      props.connection = parseInt($task.find('.js-scheduler-task-general-view select[name="connection"]').val());
      props.retryCount = parseInt($task.find('.js-scheduler-task-general-view input[name="retryCount"]').val());
      props.priority = $task.find('.js-scheduler-task-general-view input[name="priority"]').val();
      props.description = $task.find('.js-scheduler-task-general-view textarea[name="description"]').val();
      props.script = this.script.getValue();
      props.technology = parseInt(this.script.getTechnology());
      props.groups = this.groups.getValue();
      props.primaryGroup = this.groups.getPrimaryGroup();
      props.dependencies = this.dependencies.getValue();
      props.owners = this.owners.getValue();
      props.primaryOwner = this.owners.getPrimaryOwner();
      props.active = this.$el.find('.js-scheduler-task-general-view #radio-active-1').prop('checked');
      
      return props;
    },


    show: function(){
    },

    hide: function(){
      this.$el.remove();
    }



	});

	return Task;
});