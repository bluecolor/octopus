define([
	'underscore',
  'backbone',
  'text!templates/connections/html/connection.html',
  'plugins/Message',
  'collections/ConnectionStore',
  'models/ConnectionModel',
  'ajax/Connection',
  'ajax/User',
  'constants/index',
  'views/shared/Combo'
], function (_, Backbone, template,Message, ConnectionStore, ConnectionModel, AjaxConnection, User, Constants, Combo) {
	'use strict';

	let Connection = Backbone.View.extend({

    tagName   : 'section',
    className : 'js-connection-view',
    template  : _.template(template),


		events: {
      "click  .js-cancel-btn": function(){ window.history.back();},
      "click  .js-save-btn": "onSave",
      "click  .js-test-btn": "onTest",
      "change .js-connection-type": "changeConnectionType",
      "input form[name='connection-form'] input": "validate",
      "click #radio-remote": "onSelectOdiRemote",
      "click #radio-local": "onSelectOdiLocal",
		},

    onSelectOdiRemote: function(){
      this.$el.find('.js-odi-ssh').removeClass('hidden');
    },

    onSelectOdiLocal: function(){
      this.$el.find('.js-odi-ssh').addClass('hidden');
    },

		initialize: function () {
      return this;
		},

		render: function () { 	
      this.$el.html(this.template());
      this.initAuth();

        

      const masterRepo = new Combo({
        label : 'Master Repository',
        store : [],
        name  : 'masterRepo',
        button: {
          ref : 'javascript:void(0);',
          cls  : 'fa-refresh',
          clear: false,
          onb2 : function(){;}
        }
      });

      masterRepo.$el.insertAfter(this.$el.find('.js-odi-props .form-group[name="masterRepo"]'));
      


      const workRepo = new Combo({
        label : 'Work Repository',
        store : [],
        name  : 'workRepo',
        button: {
          ref : 'javascript:void(0);',
          cls  : 'fa-refresh',
          clear: false,
          onb2 : function(){;}
        }
      });


      workRepo.$el.insertAfter(this.$el.find('.js-odi-props .form-group[name="workRepo"]'));



      const ssh = new Combo({
        label : 'SSH Connection',
        store : ConnectionStore.where({connectionType: 'SSH'}),
        name  : 'odiSSH',
        button: false
      });

      ssh.$el.insertAfter(this.$el.find('.js-odi-props .form-group[name="ssh"]'));



      return this;
    },

    connectionTypes: {
        JDBC: '.js-jdbc-props',
        SSH : '.js-ssh-props',
        FTP : '.js-ftp-props',
        ODI : '.js-odi-props',
        show: function(prop){
          const props = ['JDBC','SSH','FTP','ODI'];
          for(let p of props){
            if(p==prop){
              $(this[p]).removeClass('hidden');
            }else if(!$(this[p]).hasClass('hidden')){
              $(this[p]).addClass('hidden');
            }
          }  
        } 
    },

    changeConnectionType: function(e){
      this.connectionTypes.show($(e.currentTarget).val());
      this.validate();
    },

    setValues: function(id){
      this.modelId =  id;
      this.model = ConnectionStore.get(this.modelId) || new ConnectionModel(); 
      const con = this.model.attributes;

      this.connectionTypes.show(con.connectionType);
      this.$el.find('.js-connection-type').val(con.connectionType);
      this.$el.find('.js-connection-name').val(con.name);
      switch(con.connectionType){
        case 'JDBC':  
          this.$el.find('.js-jdbc-props [name="jdbcUrl"]').val(con.jdbcUrl);
          this.$el.find('.js-jdbc-props [name="username"]').val(con.username);
          this.$el.find('.js-jdbc-props [name="password"]').val(con.password);
          break;
        case 'SSH' :
          this.$el.find('.js-ssh-props [name="host"]').val(con.host);
          this.$el.find('.js-ssh-props [name="port"]').val(con.port);
          this.$el.find('.js-ssh-props [name="username"]').val(con.username);
          this.$el.find('.js-ssh-props [name="password"]').val(con.password);  
          break;
        case 'FTP' :
          this.$el.find('.js-ftp-props [name="host"]').val(con.host); 
          this.$el.find('.js-ftp-props [name="port"]').val(con.port);
          this.$el.find('.js-ftp-props [name="username"]').val(con.username);
          this.$el.find('.js-ftp-props [name="password"]').val(con.password);
          break; 
        case 'ODI':
          this.$el.find('.js-ftp-props [name="host"]').val(con.host); 
          this.$el.find('.js-ftp-props [name="port"]').val(con.port);
          this.$el.find('.js-ftp-props [name="username"]').val(con.username);
          this.$el.find('.js-ftp-props [name="password"]').val(con.password);
        case 'LOCAL': 
          break;
      }      

      return this;
    },

    onTest: function(){
      const connection = this.getProps();
      AjaxConnection.test(connection);
    },

    onSave: function(){
      var me = this;

      const loading = Ladda.create( document.querySelector('.js-save-btn') );
      loading.start();

      let connection = this.getProps();
      
      const onSuccess = function(){
        if(!me.modelId){
          ConnectionStore.add(me.model);
        }
        Backbone.history.navigate('#/connections', {trigger:true});
        Message.notifySuccess('Connection saved!');
      };
      const onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      };
      const onComplete = function(){
        loading.stop();
        loading.remove();
      };

      this.model.save(connection,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });
    },

    getProps : function(){
      var props = {id:this.modelId};
      props.name = $('.js-connection-name').val();
      props.connectionType = $('.js-connection-type').val();
      switch(props.connectionType){
        case 'JDBC' : 
          props.jdbcUrl = $('.js-jdbc-props [name="jdbcUrl"]').val();
          props.username= $('.js-jdbc-props [name="username"]').val();
          props.password= $('.js-jdbc-props [name="password"]').val();
          break;
        case 'SSH' :
          props.host = $('.js-ssh-props [name="host"]').val(); 
          props.port = $('.js-ssh-props [name="port"]').val();
          props.username= $('.js-ssh-props [name="username"]').val();
          props.password= $('.js-ssh-props [name="password"]').val();
          break;
        case 'FTP' :
          props.host = $('.js-ftp-props [name="host"]').val(); 
          props.port = $('.js-ftp-props [name="port"]').val();
          props.username= $('.js-ftp-props [name="username"]').val();
          props.password= $('.js-ftp-props [name="password"]').val();
          break;  
        case 'ODI' :
          props.host = $('.js-odi-props [name="host"]').val(); 
          props.port = $('.js-odi-props [name="port"]').val();
          props.username= $('.js-odi-props [name="username"]').val();
          props.password= $('.js-odi-props [name="password"]').val();
          props.workRepo= $('.js-odi-props [name="workRepo"]').val();
          break;
        case 'LOCAL': 
          break;
      }
      return props;
    },
    
    validate : function(con){
      con = this.getProps();
      var isValid = true;
      
      if(_.isEmpty(con.name)||_.isEmpty(con.connectionType)) {
        isValid = false;
      }
      if(con.connectionType == 'JDBC' && _.isEmpty(con.jdbcUrl) ){
        isValid = false;
      }

      if(['JDBC','LOCAL'].indexOf(con.connectionType) == -1 && _.isEmpty(con.host) ){
        isValid = false;
      }
      

      this.enableActionButtons(isValid);
      return isValid;
    },

    enableActionButtons: function(enable){
      if(enable){
        $('.js-save-btn').removeClass('disabled');
        $('.js-test-btn').removeClass('disabled');
      }else{
        $('.js-save-btn').addClass('disabled');
        $('.js-test-btn').addClass('disabled');
      }
    },

    show: function(id){
      return this.setValues(id);
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

	return Connection;
});