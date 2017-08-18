define([
	'underscore',
  'backbone',
  'constants/index',
  'text!templates/reports/html/reports-home.html',
  'collections/index',
  'ajax/User',
  'ajax/Task',
  'ajax/TaskInstance',
  'ajax/Report',
], function (_, Backbone, Constants, template, Store, User, AjaxTask, AjaxTaskInstance, Report) {
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
      
      const models = Store.GroupStore.models;
      if(_.isEmpty(models)){
        this.$el.find('.js-group-stats').addClass('hidden');
        this.$el.find('.js-group-stats-zd').removeClass('hidden');
        return;
      }else{
        this.$el.find('.js-group-stats').removeClass('hidden');
        this.$el.find('.js-group-stats-zd').addClass('hidden');
      }
      
      
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
                    beginAtZero:true,
                    stepSize: 5,
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

      const models = Store.PlanStore.models;
      if(_.isEmpty(models)){
        this.$el.find('.js-plan-stats').addClass('hidden');
        this.$el.find('.js-plan-stats-zd').removeClass('hidden');
        return;
      }else{
        this.$el.find('.js-plan-stats').removeClass('hidden');
        this.$el.find('.js-plan-stats-zd').addClass('hidden');
      }


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
                    beginAtZero:true,
                    stepSize: 10,
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

    drawOwnerStats: function(){
      const me = this;
      Report.ownerTaskStats().done(function(d){
        if(_.isEmpty(d)){
          me.$el.find('.js-owner-task-stats').addClass('hidden');
          me.$el.find('.js-owner-task-stats-zd').removeClass('hidden');
          return;
        }else{
          me.$el.find('.js-owner-task-stats').removeClass('hidden');
          me.$el.find('.js-owner-task-stats-zd').addClass('hidden');
        }
        const ctx = me.$el.find('.js-owner-task-stats');
        let options = {
          responsive: true,
          maintainAspectRatio: false,  
          legend: {
            display: true
          }
        };
        let data = {
          labels : _.map(d,r => r.owner.name),
          datasets: [{
            data : _.map(d,r => r.taskCount),
            backgroundColor: _.map(d,x => Constants.Color.randomRgba(0.2)),
          }]
        };
        let pie = new Chart(ctx,{
          type: 'pie',
          data: data,
          options: options
        });

      });    
    },

    drawRunningTasks: function(){

      let data = {
        labels : [moment().format("hh:mm:ss")],
        datasets : [
          {
            data : [0]
          },
        ]
      };

      const options = {
        elements: {
          line: {
            tension: 0, // disables bezier curves
          }
        },
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true 
            }
          }]
        }
      };

      const ctx = this.$el.find('.js-running-tasks'); 
 
      let chart = undefined;
      const update = () => {
        AjaxTaskInstance.findByStatus('RUNNING').done(function(d){
          const cnt = d.length;
          data.labels.push(moment().format("hh:mm:ss"));
          
          if(data.labels.length > 10){
            data.datasets[0].data.shift();
            data.labels.shift();
          }
          data.datasets[0].data.push(100*Math.random());

          if(!chart){
            const chart = new Chart(ctx, {
              type: 'line',
              data: data,
              options: options
            });  
          }else{
            chart.update();
          }

          
        });  
        
      };
      
      setInterval(function(){
        update();
      }, 5000);
      
    },

		render: function () { 	
      this.$el.html(this.template());
      this.drawPlanStats();
      this.drawGroupStats();
      this.drawOwnerStats();
      this.drawRunningTasks();
      this.initAuth();
      return this;
    },
    
    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.js-new-connection').removeClass('hidden');
        this.$el.find('.js-new-group').removeClass('hidden');
      }else{
        this.$el.find('.js-new-connection').addClass('hidden');
        this.$el.find('.js-new-group').addClass('hidden');
      }
    }

	});

	return ReportsHome;
});