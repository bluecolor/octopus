define([
	'underscore',
  'backbone',
  'text!templates/scheduler/plan/html/plan.html',
  'plugins/Message',
  'models/PlanModel',
  'collections/PlanStore',
  'views/shared/ConnectionList'
], function (_, Backbone, template, Message, PlanModel, PlanStore, ConnectionList) {
	'use strict';

	let Plan = Backbone.View.extend({

		el: '',

    tagName: 'section',

    className: 'js-plan',

		template: _.template(template),

    events: {
      "click .js-save-btn": "save",
      "click .js-cancel-btn": "onCancel",
      "change select, input.form-control.slider, input[id^='radio']" :"validate",
      "input textarea[name='description'], input,.script-editor": "validate"
		},

		initialize: function(id) {
      this.modelId=id;
      return this;
		},

		render: function () { 	
      const me = this;
      this.$el.html(this.template({id:me.modelId}));
      let cons = new ConnectionList(),$cons= cons.render().$el;
      $cons.attr('name', 'plan-connection');
      $cons.insertAfter(this.$el.find('.form-group.js-plan-name'));
      
      setTimeout(function(){
        me.$el.find("input.slider").slider({
          ticks: [1,2,3,4],
          ticks_labels: ["Low", "Medium", "High","Top"],
        });
      },10);

      me.show(me.modelId);
      return this;
    },

    setValues: function(){
      const p = this.model.attributes;
      this.$el.find('input[name="name"]').val(p.name);
      this.$el.find('input[name="schedule"]').val(p.schedule);
      this.$el.find('#radio-protected-1').prop('checked', p.protect);
      this.$el.find('#radio-active-1').prop('checked', p.active);
      this.$el.find('[name="plan-connection"] select').val(p.connection?p.connection.id:-1);
      this.$el.find('input[name="parallel"]').val(p.parallel);
      this.$el.find('input[name="priority"]').val(p.priority);
      this.$el.find('[name="description"]').val(p.description);
      
      if(this.modelId){
        this.$el.find('.js-tasks').removeClass('disabled');
      }
      
      return this;
  
    },

    show: function(id){
      this.modelId = id;
      this.model = PlanStore.get(id) || new PlanModel();    
      this.setValues();
    },

    hide: function(){
      this.$el.remove();
    },

    onCancel: function(){
      window.history.back();
    },

    save: function(){
      let me = this,
          plan = this.getProps();
      
      const loading = Ladda.create( document.querySelector('.js-plan .js-save-btn') );
      loading.start();

      const onSuccess = function(){
        if(!me.modelId){
          PlanStore.add(me.model);
        }
        
        Message.notifySuccess('Plan saved!');
        window.history.back();
      },
      onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      me.model.save(plan,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });

    },

    validate: function(){
      
      let isValid= true, p = this.getProps();

      if(_.isEmpty(p.name)){
        isValid = false;
      } 
      if(p.priority <1 || p.priority >4){
        isValid = false;
      }
      if(p.parallel< 1 ) {
        isValid = false;
      }

      if(_.isEmpty(p.schedule)){
        isValid = false;
      }

      if(_.isNaN(p.connection)){
        isValid = false;
      }

      this.enableActionButtons(isValid);

      return isValid;
    },

    enableActionButtons: function(enable){
      if(enable){
        this.$el.find('.js-save-btn').removeClass('disabled');
      }else{
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

    getProps: function(){
      let props = {};

      props.id = this.modelId;
      props.name = this.$el.find('input[name="name"]').val();
      props.schedule= this.$el.find('input[name="schedule"]').val();
      props.connection = parseInt(this.$el.find('[name="plan-connection"] select').val()); 
      props.parallel = this.$el.find('input[name="parallel"]').val();    
      props.priority = this.$el.find('input[name="priority"]').val();
      props.description = this.$el.find('[name="description"]').val();
      props.protect = this.$el.find('#radio-protected-1').prop('checked');
      props.active  = this.$el.find('#radio-active-1').prop('checked');

      return props;
    }


	});

	return Plan;
});