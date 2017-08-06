define([
	'underscore',
  'backbone',
  'constants/index',
  'text!templates/reports/html/reports-home.html',
  'collections/index',
  'ajax/User',
  'ajax/Task'  
], function (_, Backbone, Constants, template, Store, User, AjaxTask ) {
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

    drawDependencies: function(){

      const toNodesAndLinks = (tasks) => {
        let data = {
          nodes: [],
          links: []
        };

        data.nodes = _.map(tasks,(t)=>{
          return {
            name: t.name,
            group: t.primaryGroup ? t.primaryGroup.id: 0
          }
        });

        data.links = _.chain(tasks).map((t) => {
         return  _.map(t.dependencies,(d)=>{
            return {
              source: data.nodes.findIndex( i => i.name == t.name ),
              target: data.nodes.findIndex(i => i.name == d.name),
              value : t.primaryGroup ? t.primaryGroup.id: 0
            }
          });

        }).flatten().value();

        console.log(data);

        return data;

      };


      const draw = (tasks) => {
        let data = toNodesAndLinks(tasks);
        var width = 500, height = 500;

              
        var color = d3.scale.category20();

        var fisheye = d3.fisheye.circular()
            .radius(120);

        var force = d3.layout.force()
            .charge(-240)
            .linkDistance(40)
            .size([width, height]);

        var svg = d3.select("#chart1").append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);

      
        var n = data.nodes.length;

        force.nodes(data.nodes).links(data.links);

        // Initialize the positions deterministically, for better results.
        data.nodes.forEach(function(d, i) { d.x = d.y = width / n * i; });

        // Run the layout a fixed number of times.
        // The ideal number of times scales with graph complexity.
        // Of course, don't run too long—you'll hang the page!
        force.start();
        for (var i = n; i > 0; --i) force.tick();
        force.stop();

        // Center the nodes in the middle.
        var ox = 0, oy = 0;
        data.nodes.forEach(function(d) { ox += d.x, oy += d.y; });
        ox = ox / n - width / 2, oy = oy / n - height / 2;
        data.nodes.forEach(function(d) { d.x -= ox, d.y -= oy; });

        var link = svg.selectAll(".link")
            .data(data.links)
          .enter().append("line")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
            .style("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = svg.selectAll(".node")
            .data(data.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", 4.5)
            .style("fill", function(d) { return color(d.group); })
            .call(force.drag);

        svg.on("mousemove", function() {
          fisheye.focus(d3.mouse(this));

          node.each(function(d) { d.fisheye = fisheye(d); })
              .attr("cx", function(d) { return d.fisheye.x; })
              .attr("cy", function(d) { return d.fisheye.y; })
              .attr("r", function(d) { return d.fisheye.z * 4.5; });

          link.attr("x1", function(d) { return d.source.fisheye.x; })
              .attr("y1", function(d) { return d.source.fisheye.y; })
              .attr("x2", function(d) { return d.target.fisheye.x; })
              .attr("y2", function(d) { return d.target.fisheye.y; });
        });
       
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
      this.drawDependencies();
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