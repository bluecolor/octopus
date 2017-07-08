define([
	'underscore',
  'backbone',
  'text!templates/scheduler/parameter/html/parameter.html',
  'plugins/Message',
  'collections/ParameterStore',
  'models/ParameterModel',
  'constants/index',
  'ajax/User'
], function (_, Backbone, template, Message, ParameterStore, ParameterModel, Constants, User) {
	'use strict';

	let Parameter = Backbone.View.extend({

    tagName   : 'section',
    className : 'js-parameter',
    template  : _.template(template),

		events: {
      "click .js-cancel-btn": "onCancel",
      "click .js-save-btn"  : "onSave",
      "input input,textarea": "validate"
		},

    onCancel: function(){
      window.history.back();
    },

    onSave: function(){
      const me = this,
            param = this.getProps();
    
      
      const loading = Ladda.create( document.querySelector('.js-parameter .js-save-btn') );
      loading.start();
      
      const onSuccess = function(){
        if(!param.id){
          ParameterStore.add(me.model);
        }
        window.history.back();
        Message.notifySuccess('Parameter saved!');
      },
      onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      this.model.save(param,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });
    },

    setValues: function(id){
      this.model = ParameterStore.get(id) || new ParameterModel();  
      const attr = this.model.attributes;
      this.modelId = id;
      
      this.$el.find('input[name="name"]').val(attr.name);
      this.$el.find('input[name="value"]').val(attr.value); 
      this.$el.find('textarea[name="description"]').val(attr.description);
    },

    
    getProps: function(){
      let props = {},
          $param = this.$el;
      
      props.id = this.modelId;
      props.name = $param.find('input[name="name"]').val();
      props.value= $param.find('input[name="value"]').val(); 
      props.description = $param.find('textarea[name="description"]').val();
      return props;
    },

    validate: function(){
      const props = this.getProps();
      let isValid = true;

      isValid = !(_.isEmpty(props.name) || _.isEmpty(props.value));
      this.enableActionButtons(isValid);
      return this;
    },

    enableActionButtons: function(enable){
      if(enable){
        this.$el.find('.js-save-btn').removeClass('disabled');
      }else{
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

		initialize: function (id) {
      this.modelId = id;
      return this;
    },

		render: function () { 	
      this.$el.html(this.template());
      this.initAuth();
      return this;
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.js-save-btn').removeClass('hidden');
        this.$el.find('.js-item').removeAttr("disabled");
      }else{
        this.$el.find('.js-save-btn').addClass('hidden');
        this.$el.find('.js-item').attr("disabled","disabled");
      }
    }

	});

	return Parameter;
});