define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task/html/general.html',
  'views/shared/Combo',
  'collections/index'
], function (_, Backbone, template, Combo, Store) {
	'use strict';

	let TaskGeneral = Backbone.View.extend({

    tagName   : 'div',
    className : 'js-scheduler-task-general-view',
		template  : _.template(template),
    events    : {
		},

		initialize: function () {
		},

		render: function () { 	
      const me = this;
      me.$el.html(this.template());
      me.initSlider();
      
      const connections = new Combo({ 
        label: 'Connection',
        store: Store.ConnectionStore,
        name  : 'connection'
      });

      connections.$el.insertAfter(me.$el.find('.form-group.js-task-name'));

      const plans = new Combo({
        label : 'Run Plan',
        store : Store.PlanStore,
        name  : 'plan'
      });

      plans.$el.insertAfter(me.$el.find('.form-group.js-task-name'));

      return this;

    },

    initSlider: function(){
      const me = this;
      setTimeout(function(){
        me.priority = me.$el.find("input.slider").slider({
          ticks: [1, 2,3,4],
          ticks_labels: ["Low", "Medium", "High","Top"],
        });
      },0);
    }

	});

	return TaskGeneral;
});