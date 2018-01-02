define([
	'underscore',
  'backbone',
  'text!templates/scheduler/session/html/session.html',
  'plugins/Message',
  'models/SessionModel',
  'collections/SessionStore'
], function (_, Backbone, template, Message, SessionModel, SessionStore) {
	'use strict';

	let Session = Backbone.View.extend({

		el: '',

    tagName: 'section',

    className: 'js-session',

		template: _.template(template),

    events: {
      "click .js-save-btn": "save",
      "click .js-cancel-btn": "onCancel",
      "change select, input.form-control.slider,  input[id^='radio']" :"validate",
      "input .input": "validate"
		},

		initialize: function(id) {
      this.modelId = id
      return this;
		},

		render: function () { 	
      const me=this;
      me.$el.html(this.template({id:me.modelId}));
      me.show();
      return me;
    },

    setValues: function(){
      const m = this.model.attributes;
      this.$el.find('input[name="name"]').val(m.name);
      this.$el.find('input[name="scheduleDate"]').val(moment(m.scheduleDate).format("YYYY.MMM.DD HH:mm:ss"));
      this.$el.find('input[name="parallel"]').val(m.parallel);
      this.$el.find('input[name="priority"]').val(m.priority);
      this.$el.find('[name="description"]').val(m.description);
      
      return this;
    },

    show: function(){
      this.model = SessionStore.get(this.modelId) || new SessionModel();    
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
          session = this.getProps();
      
      const loading = Ladda.create( document.querySelector('.js-session .js-save-btn') );
      loading.start();

      const onSuccess = function(){
        Message.notifySuccess('Session saved!');
        window.history.back();
      },
      onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      me.model.save(session,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });

    },

    validate: function(){
      this.enableActionButtons(true);
      return true;
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
      props.parallel = this.$el.find('input[name="parallel"]').val();    
      props.priority = this.$el.find('input[name="priority"]').val();
      props.description = this.$el.find('[name="description"]').val();
      
      return props;
    }


	});

	return Session;
});