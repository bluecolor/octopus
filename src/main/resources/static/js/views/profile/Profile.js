define([
	'underscore',
  'backbone',
  'text!templates/profile/html/profile.html',
  'collections/UserStore',
  'plugins/Message',
  'ajax/User'
], function (_, Backbone, template, UserStore, Message, User ) {
	'use strict';

	var Profile = Backbone.View.extend({

    className : 'content js-profile',
    template  : _.template(template),
		
    events: {
      "click .js-save-btn": "onSave",
      "click .js-cancel-btn": "onCancel",
      "input input": "validate"
		},

		initialize: function() {
      return this;
    },

		render: function () { 	
      this.$el.html(this.template());
      this.setValues();
      return this;
    },

    validate: function(){
      let isValid= true, p = this.getProps();
       isValid = !( 
        _.isEmpty(p.username) ||
        _.isEmpty(p.name)     ||
        _.isEmpty(p.email)
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
      return props;
    },

    setValues: function(){
      const me = this;
      User.findMe().done((d)=>{
        me.$el.find('input[name="username"]').val(d.username);
        me.$el.find('input[name="name"]').val(d.name);
        me.$el.find('input[name="email"]').val(d.email);
      }).fail(()=>{
        Message.error("Unable to get user profile!")
      });
    },

    onSave: function(){
      const user  = this.getProps();
      const loading = Ladda.create( document.querySelector('.js-profile .js-save-btn') );
      loading.start();
      User.updateProfile(user).always(()=>{
        loading.stop();
        loading.remove();
      })      
    },

    onCancel: function(){
      window.history.back(); 
    }


	});

	return Profile;
});