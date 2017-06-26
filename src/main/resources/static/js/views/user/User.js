define([
	'underscore',
  'backbone',
  'text!templates/user/html/user.html',
  'models/UserModel',
  'collections/UserStore',
  'plugins/Message'
], function (_, Backbone, template, UserModel, UserStore, Message ) {
	'use strict';

	var User = Backbone.View.extend({

    className : 'content js-user',
    template  : _.template(template),
		
    events: {
      "click .js-save-btn": "onSave",
      "click .js-cancel-btn": "onCancel",
      "input input": "validate",
      'change select,input[name="role"]': "validate"
    },

		initialize: function(id) {
      this.modelId = id;
      return this;
    },

		render: function () { 	
      this.$el.html(this.template());
      this.setValues();
      return this;
    },

    validate: function(){
      console.log('v')
      let isValid= true, p = this.getProps();
       isValid = !( 
        _.isEmpty(p.username) ||
        _.isEmpty(p.name)     ||
        _.isEmpty(p.email)    ||  
        _.isNaN(p.role)  
      );

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

    getProps: function(){
      let props = {};
      
      props.id = this.modelId;
      props.name= this.$el.find('input[name="name"]').val();
      props.username = this.$el.find('[name="username"]').val(); 
      props.email = this.$el.find('[name="email"]').val(); 
      props.role = this.$el.find('[name="role"]').val();    
      props.locked = this.$el.find('#user-locked-1').prop('checked');
      return props;
    },

    show: function(o){
      this.modelId = o.id || this.modelId;
    },

    setValues: function(id){
      this.modelId = id || this.modelId;
      this.model = UserStore.get(this.modelId) || new UserModel();  
      const attr = this.model.attributes;
      this.$el.find('input[name="username"]').val(attr.username);
      this.$el.find('input[name="name"]').val(attr.name);
      this.$el.find('input[name="email"]').val(attr.email);
      this.$el.find('input[name="role"]').val(attr.role);
      this.$el.find('#user-locked-1').prop('checked', attr.locked);
    },

    onSave: function(){
      const me = this,
            user  = this.getProps();

      const loading = Ladda.create( document.querySelector('.js-user .js-save-btn') );
      loading.start();

      const onSuccess = function(){
        if(!user.id){
          UserStore.add(me.model);
        }
        Message.notifySuccess('User saved!');
        window.history.back();
      },
      onError = function(err, response){
        let msg = _.map(response.responseJSON.errors,e => e.defaultMessage).join(" - ")
        Message.notifyDanger(`${response.responseJSON.message} ${msg}`);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      this.model.save(user,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });
    },

    onCancel: function(){
      window.history.back(); 
    }


	});

	return User;
});