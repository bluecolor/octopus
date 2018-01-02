define([
	'underscore',
  'backbone',
  'text!templates/scheduler/html/scheduler-monitor.html',
  'collections/TaskStore',
  'collections/PlanStore',
  'collections/SessionStore',
  'collections/TaskInstanceStore',
  'collections/AlertStore',
  'constants/index'
], function (_, Backbone, template, TaskStore, PlanStore,SessionStore, TaskInstanceStore,AlertStore,Constants) {
	'use strict';

	var SchedulerMonitor = Backbone.View.extend({

		el: '',

    tagName   : 'section',
    className : 'content js-scheduler-general-view',
		template  : _.template(template),
    events    : {
		},

		initialize: function () {
      const me = this;
      this.listenTo(TaskStore, 'reset', function(){
        me.render();
      });
      this.listenTo(PlanStore, 'reset', function(){
        me.render();
      });
      this.listenTo(SessionStore, 'reset', function(){
        me.render();
      });

      setInterval(function(){
        me.render();
      },5000)
      return this;
    },

		render: function () { 	
      let stats = {
        errorCount: AlertStore.models.length,
        taskCount: TaskStore.state.count,
        planCount: PlanStore.models.length,
        sessionCount: _.filter(SessionStore.models,(session) =>{
          const s = Constants.Status;
          return [s.DONE,s.SUCCESS].indexOf(session.get('status')) == -1
        }).length 
      }
      this.$el.html(this.template(stats));
      this.initSearch()
      return this;
    },

    initSearch: function(text){
      let $s = this.$el.find('input[name="search"]');
      
      $s.on('input',function() {
        const val = this.value;
        Backbone.trigger("route", {route:"SEARCH", text:val});
      });
      
    }



	});

  

	return SchedulerMonitor;
});