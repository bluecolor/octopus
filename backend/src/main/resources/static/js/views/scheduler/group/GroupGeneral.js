define([
	'underscore',
  'backbone',
  'text!templates/scheduler/group/html/group-general.html',
  'views/shared/ConnectionList'
], function (_, Backbone, template) {
	'use strict';

	var GroupGeneral = Backbone.View.extend({

    tagName: 'div',

    className: 'js-scheduler-group-general-view',

		template: _.template(template),

    events: {
		},

		initialize: function () {
		},

		render: function () { 	
      this.$el.html(this.template());
      let me = this;
      setTimeout(function(){
        $('.js-group-color').colorpicker();
        me.$el.find("input.slider").slider({
        ticks: [1,2,3,4],
        ticks_labels: ["Low", "Medium", "High","Top"],
      });
      },10);
      
      return this;
    },

    show: function(){
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    }

	});

	return GroupGeneral;
});