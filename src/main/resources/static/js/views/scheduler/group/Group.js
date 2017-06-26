define([
	'underscore',
  'backbone',
  'text!templates/scheduler/group/html/group.html',
  'plugins/Message',
  'models/GroupModel',
  'collections/GroupStore',
  'views/scheduler/group/GroupGeneral',
], function (_, Backbone, template, Message, GroupModel, GroupStore) {
	'use strict';

	var Group = Backbone.View.extend({

		el: '',

    tagName   : 'section',
    className : 'js-group',
		template  : _.template(template),
    events    : {
      "click .js-cancel-btn": "onCancel",
      "click .js-save-btn"  : "onSave",
      "changeColor .colorpicker-component": 'validate',
      "change select, input.form-control.slider,  input[id^='radio-active']" :"validate",
      "input textarea[name='description'], input": "validate"
    },

		initialize: function () {
      return this;
		},

		render: function () { 	
      const me = this;
      this.$el.html(this.template());
      
      setTimeout(function(){
        $('.js-group-color').colorpicker();
          me.$el.find("input.slider").slider({
          ticks: [1,2,3,4],
          ticks_labels: ["Low", "Medium", "High","Top"],
        });
      },10);
      
      return this;
    },

    setValues: function(id){
      this.model = GroupStore.get(id) || new GroupModel();  
      const g = this.model.attributes;
      
      this.modelId = g.id
      this.$el.find('input[name="name"]').val(g.name);
      this.$el.find('input[name="parallel"]').val(g.parallel);
      this.$el.find('input[name="priority"]').val(g.priority);
      this.$el.find('input[name="color"]').val(g.color);
      this.$el.find('textarea[name="description"]').val(g.description);
      
      return this;
    },

    show: function(id){
      this.$el.show();
      this.setValues(id);
    },

    hide: function(){
      this.$el.hide();
    },

    validate: function(){
      let isValid = true; 
      const p = this.getProps();

      if(_.isEmpty(p.name)){
        isValid = false;
      } 
      this.enableActionButtons(isValid);
      return isValid;
    },

    getProps: function(){
      let props = {};

      props.id = this.modelId;
      props.name = this.$el.find('input[name="name"]').val();
      props.parallel = this.$el.find('input[name="parallel"]').val();
      props.priority = parseInt(this.$el.find('input[name="priority"]').val());
      props.color = this.$el.find('input[name="color"]').val();
      props.description = this.$el.find('textarea[name="description"]').val();
      
      return props;
    },

    enableActionButtons: function(enable){
      if(enable){
        this.$el.find('.js-save-btn').removeClass('disabled');
      }else{
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

    onCancel: function(){
      window.history.back();
    },

    onSave: function(){
      let group = this.getProps(),
          model= new GroupModel();
      
      const loading = Ladda.create(document.querySelector('.js-group .js-save-btn') );
      loading.start();

      const onSuccess = function(){
        GroupStore.add(model);
        Message.notifySuccess('Group saved!');  
        window.history.back();      
      },
      onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      model.save(group,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });

    }

	});

	return Group;
});