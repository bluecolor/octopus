define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/alert/AlertTable'
], function (_, Backbone, Route, AlertTable ) {
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

    showAlertTable: function(){
      this.hideActiveView();
      this.alertTable = new AlertTable();
      this.$el.append(this.alertTable.render().el);
      this.config.activeView = this.alertTable;
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