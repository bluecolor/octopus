define([
	'underscore',
  'backbone',
  'constants/Route',
  'collections/index',
  'views/alert/AlertTable',
  'views/alert/ZeroAlert',
], function (_, Backbone, Route, Store, AlertTable, ZeroAlert ) {
	'use strict';

	var AlertView = Backbone.View.extend({

    tagName   : 'section',
    className : 'js-alert-view',
		events    : {
		},

		initialize: function() {
      this.config = {}
      return this;
		},

		render: function () { 	
      return this;
    },
    
    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        this.config.activeView = null;
      }
    },

    showZeroAlert: function(){
      this.hideActiveView();
      if(!this.zeroAlert){
        this.zeroAlert = new ZeroAlert();
        this.$el.append(this.zeroAlert.render().el);
      }else {
        this.zeroAlert.$el.show();
      }
      this.config.activeView = this.zeroAlert; 
    },

    showAlertTable: function(){
      this.hideActiveView();
      if(_.isEmpty(Store.AlertStore.models)){
        this.showZeroAlert();
      }else {
        this.alertTable = new AlertTable();
        this.$el.append(this.alertTable.render().el);
        this.config.activeView = this.alertTable;
      }
    },

    show: function(o){
      switch(o.route){
        case Route.ALERTS: 
          this.showAlertTable(o); 
          break;
      }
      this.$el.show();
    }

	});

	return AlertView;
});