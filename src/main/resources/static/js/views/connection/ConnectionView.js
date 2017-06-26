define([
	'underscore',
  'backbone',
  'text!templates/connections/html/connection-view.html',
  'constants/Route',
  'views/shared/Import',
  'collections/ConnectionStore',
  'views/connection/ZeroConnection',
  'views/connection/Connection',
  'views/connection/ConnectionTable'
], function (_, Backbone, template, Route, Import, ConnectionStore, ZeroConnection, Connection, ConnectionTable) {
	'use strict';

	let ConnectionView = Backbone.View.extend({

		
    tagName   : 'section',
    className : 'content js-connection-view',
    template  : _.template(template),
		events    : {
		},

		initialize: function () {
      return this;
    },


    showConnectionTable: function(){
      this.hideConnection();
      this.hideZeroConnection();
      this.hideImport();
      if(_.isEmpty(ConnectionStore.models)){
        this.showZeroConnection();
      }else{
        if(!this.connectionTable){
          this.connectionTable = new ConnectionTable();
          this.$el.append(this.connectionTable.el);
        }else {
          this.connectionTable.$el.show();
        }  
      }
    },

    hideConnectionTable: function(){
      if(this.connectionTable){
        this.connectionTable.$el.hide();
      }
    },

    showConnection: function(id){
      this.hideZeroConnection();
      this.hideConnectionTable();
      this.hideImport();
      if(!this.connection){
        this.connection = new Connection();
        this.$el.append(this.connection.render().el);
      }
      this.connection.show(id);
    },

    hideConnection: function(){
      if(this.connection){
        this.connection.$el.remove();
        this.connection = null;
      }
    },

    showZeroConnection: function(){
      this.hideConnection();
      this.hideConnectionTable();
      this.hideImport();
      if(!this.zeroConnection){
        this.zeroConnection = new ZeroConnection();
        this.$el.append(this.zeroConnection.render().el);
      }else {
        this.zeroConnection.$el.show();
      }
    },

    hideZeroConnection: function(){
      if(this.zeroConnection){
        this.zeroConnection.$el.hide();
      }
    },

    showImport: function(){
      this.hideConnection();
      this.hideZeroConnection();
      this.hideConnectionTable();
      let cb = () => {
        ConnectionStore.fetch({reset:true, data:{fetch:true, type:"get"}});
      };
      this.import = new Import({cb:cb});
      this.$el.append(this.import.render().el);
    },

    hideImport: function(){
      if(this.import){
        this.import.$el.remove();
        this.import = null;
      }
    },

    show: function(o){
      switch(o.route){
        case Route.CONNECTIONS: 
          this.showConnectionTable(); 
          break;
        case Route.CONNECTIONS_NEW: 
        case Route.CONNECTIONS_EDIT: 
          this.showConnection(o.id); 
          break;  
        case Route.CONNECTIONS_IMPORT:
          this.showImport(o);
          break;
      }
    },

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return ConnectionView;
});