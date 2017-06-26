define([
	'underscore',
  'backbone',
  'constants/Route',
  'text!templates/reports/html/reports-home.html',
  'collections/index'
], function (_, Backbone, Route, template, Store ) {
	'use strict';

	var ReportsHome = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-reports-home-view',
		template  : _.template(template),
    events    : {
		},

		initialize: function() {
      this.config = {}
      this.listenTo(Store.PlanStore, 'sync', function(){
        this.drawPlanStats();
      });
      this.listenTo(Store.GroupStore, 'sync', function(){
        this.drawGroupStats();
      });
      return this;
		},

    drawGroupStats: function(){
      const ctx = this.$el.find('.js-group-stats')      
      let data = {
        labels : _.map(Store.GroupStore.models,m => m.get('name') ),
        datasets: [{
          data : _.map(Store.GroupStore.models,m => m.get('stats').taskCount),
          backgroundColor: 'rgba(255, 99, 132, 0.2)'
        }]
      };

      let options = {
        legend: {
          display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
      };

      let chart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
      });
    },

    drawPlanStats: function(){
      const ctx = this.$el.find('.js-plan-stats')
      let data = {
        labels : _.map(Store.PlanStore.models,m => m.get('name') ),
        datasets: [{
          data : _.map(Store.PlanStore.models,m => m.get('stats').taskCount),
          backgroundColor: 'rgba(54, 162, 235, 0.2)'
        }]
      };

      let options = {
        legend: {
          display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
      };

      let chart = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
      });
    },

		render: function () { 	
      this.$el.html(this.template());
      this.drawPlanStats();
      this.drawGroupStats();
      return this;
    },
    
	});

	return ReportsHome;
});