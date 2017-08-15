define([
	'underscore',
  'backbone',
  'constants/index',
  'text!templates/reports/html/reports-home.html',
  'collections/index',
  'ajax/User',
  'ajax/Task',
  'ajax/Report',
], function (_, Backbone, Constants, template, Store, User, AjaxTask, Report) {
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

    drawDependencies: function(){

      const toNodesAndLinks = (tasks) => {
        let data = {
          nodes: [],
          links: []
        };

        data.nodes = _.map(tasks,(t)=>{
          return {
            id: t.name,
            group: t.primaryGroup ? t.primaryGroup.id: 0
          }
        });

        data.links = _.chain(tasks).map((t) => {
         return  _.map(t.dependencies,(d)=>{
            return {
              source: t.name ,
              target: d.name,
              value : t.primaryGroup ? t.primaryGroup.id: 0
            }
          });

        }).flatten().value();

      
        return data;

      };


      const draw = (data) => {
        let svg = d3.select(".js-di-graph"),
          width = +svg.attr("width"),
          height= +svg.attr("height");
      
        let color = d3.scaleOrdinal(d3.schemeCategory20);
        
        var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(width / 2, height / 2));

          const dragstarted = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          }
          
          const dragged = (d) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
          }
          
          const dragended = (d) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }


        let graph = toNodesAndLinks(data);

          console.log(graph);
          

          var link = svg.append("g")
          .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
          .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
    
      var node = svg.append("g")
          .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
          .attr("r", 5)
          .attr("fill", function(d) { return color(d.group); })
          .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
    
      node.append("title")
          .text(function(d) { return d.id; });
    
      simulation
          .nodes(graph.nodes)
          .on("tick", ticked);
    
      simulation.force("link")
          .links(graph.links);
    
      function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        }




      }
      
      const plan =  Store.PlanStore.at(0);      
      if(!plan){
        return;
      } 

      AjaxTask.findByPlan(plan.get('id')).done(function(d){
        draw(d);
      });    
    },

		render: function () { 	
      this.$el.html(this.template());
      this.drawPlanStats();
      this.drawGroupStats();
      this.drawOwnerStats();
      // this.drawDependencies();
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