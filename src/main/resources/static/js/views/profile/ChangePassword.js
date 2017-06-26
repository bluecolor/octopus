define([
	'underscore',
  'backbone',
  'text!templates/profile/html/change-pass.html',
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
      this.initStrength();
      return this;
    },

    initStrength: function(){

      const me = this;

      me.$el.find('.password-background').on('click',()=>{
        me.$el.find('[name="newPassword"]').focus();
      });

      me.$el.find('[name="newPassword"]').on('propertychange change keyup paste input', function() {
        var password = $(this).val();
        var passwordScore = zxcvbn(password)['score'];
        
        var updateMeter = function(width, background, text) {
          me.$el.find('.password-background').css({"width": width, "background-color": background});
          me.$el.find('.strength').text('Strength: ' + text).css('color', background);
        }
    
        if (passwordScore === 0) {
          if (password.length === 0) {
            updateMeter("0%", "rgba(255,160,160,0.3)", "none");
          } else {
            updateMeter("20%","rgba(255,160,160,0.3)", "very weak");
          }
        }
        if (passwordScore == 1) updateMeter("40%", "rgba(255,183,140,0.3)", "weak");
        if (passwordScore == 2) updateMeter("60%", "rgba(255,236,139,0.3)", "medium");
        if (passwordScore == 3) updateMeter("80%", "rgba(195,255,136,0.3)", "strong");
        if (passwordScore == 4) updateMeter("100%","rgba(172,232,114,0.3)", "very strong"); // Color needs changing
      });
  
      me.$el.find('.show-password').click(function(event) {
        event.preventDefault();
        if (me.$el.find('[name="newPassword"]').attr('type') === 'password') {
          me.$el.find('[name="newPassword"]').attr('type', 'text');
          me.$el.find('.show-password').text('Hide password');
        } else {
          me.$el.find('[name="newPassword"]').attr('type', 'password');
          me.$el.find('.show-password').text('Show password');
        }
      });

      me.$el.find('[name="confirmNewPassword"]').on("propertychange change keyup paste input",function(){
        const a = me.$el.find('[name="newPassword"]').val(); 
        const b = $(this).val();
        if(!_.isEmpty(a) && a != b){
          $(this).css('color',"#DB5A6B");
        }else{
          $(this).css('color',"#555555")
        }
      });
    },

    validate: function(){
      let isValid= true, p = this.getProps();
       isValid = !( 
        _.isEmpty(p.currentPassword) ||
        _.isEmpty(p.newPassword)     ||
        _.isEmpty(p.confirmNewPassword)
      );

      if(p.newPassword != p.confirmNewPassword){
        isValid = false;
      }

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
      props.currentPassword= this.$el.find('input[name="currentPassword"]').val();
      props.newPassword = this.$el.find('[name="newPassword"]').val(); 
      props.confirmNewPassword = this.$el.find('[name="confirmNewPassword"]').val(); 
      return props;
    },


    onSave: function(){
      const p  = this.getProps();
      const loading = Ladda.create( document.querySelector('.js-profile .js-save-btn') );
      loading.start();
      User.changePassword(p).always(()=>{
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