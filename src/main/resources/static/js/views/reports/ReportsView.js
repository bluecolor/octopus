define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/reports/ReportsHome'
], function (_, Backbone, Route, ReportsHome ) {
	'use strict';

	var ReportsView = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-report-view',
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

    showReportsHome: function(o) {
      this.hideActiveView();
      this.reportsHome = new ReportsHome();
      this.$el.append(this.reportsHome.render().el);
      this.config.activeView = this.reportsHome;
    },

    show: function(o){
      switch(o.route){
        case Route.REPORTS: 
          this.showReportsHome(o); 
          break;
      }
      this.$el.show();
    }

	});

	return ReportsView;
});