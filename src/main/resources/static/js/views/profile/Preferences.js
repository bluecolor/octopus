define([
	'underscore',
  'backbone',
  'text!templates/profile/html/preferences.html',
  'collections/index',
  'plugins/Message',
  'ajax/User'
], function (_, Backbone, template, Store, Message, User ) {
	'use strict';

	var Preferences = Backbone.View.extend({

    className : 'content js-preferences',
    template  : _.template(template),
		
    events: {
      "click .js-save-btn": "onSave",
      "click .js-cancel-btn": "onCancel",
      "input input": "validate",
      "change input[id^='radio']" :"validate",
      "change [name='radio-deno']": 'onDeNoEnable',
		},

		initialize: function() {
      return this;
    },

		render: function () { 	
      this.$el.html(this.template());
      this.setValues();
      return this;
    },

    onDeNoEnable: function(e){
      if(e.target.value == 0)
        this.$el.find('.js-deno').attr('disabled', 'disabled');
      else 
        this.$el.find('.js-deno').removeAttr('disabled');  
    },

    validate: function(){
      this.enableActionButtons(true);
      return this;
    },

    enableActionButtons: function(enable){
      if(enable){
        this.$el.find('.js-save-btn').removeClass('disabled');
      }else{
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

    getProps: function(){
      let props = {
        deno: {
          sounds: true,
        },
        ui: {
          bellSwing: true
        }
      };
      
      const deno = this.$el.find('#radio-deno-1').prop('checked');  
      if(deno){
        props.deno.sounds = this.$el.find('#notification-sounds').prop('checked');
        props.deno.taskError = this.$el.find('#task-error').prop('checked');
        props.deno.taskKilled = this.$el.find('#task-killed').prop('checked');
        props.deno.taskBlocked = this.$el.find('#task-blocked').prop('checked');
        props.deno.taskDone = this.$el.find('#task-done').prop('checked');
      }else{
        props.deno = false;
      }

      props.ui.bellSwing = this.$el.find('#bell-swing').prop('checked');

      return props;
    },

    setValues: function(){
      const me = this;
      console.log(User.me)
      const o = User.me.opts();
      if(!o) return;
      if(o.deno == false){
        me.$el.find('#radio-deno-2').prop('checked', true);  
        me.$el.find('.js-deno').attr('disabled', 'disabled');
      }else{
        me.$el.find('.js-deno').removeAttr('disabled');
        me.$el.find('#radio-deno-1').prop('checked', true);
        me.$el.find('#notification-sounds').prop('checked', o.deno.sounds);
        me.$el.find('#task-error').prop('checked', o.deno.taskError);
        me.$el.find('#task-killed').prop('checked', o.deno.taskKilled);
        me.$el.find('#task-blocked').prop('checked', o.deno.taskBlocked);
        me.$el.find('#task-done').prop('checked', o.deno.taskDone);
      }
      
      me.$el.find('#bell-swing').prop('checked', o.ui.bellSwing);
    },

    onSave: function(){
      const options  = this.getProps();
      User.updateOptions(options, function(){
        User.me.setOptions(options);
      });
    },

    onCancel: function(){
      window.history.back(); 
    }


	});

	return Preferences;
});