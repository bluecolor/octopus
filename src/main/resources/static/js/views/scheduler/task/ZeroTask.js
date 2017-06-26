define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task/html/zero-task.html'
], function (_, Backbone, template) {
	'use strict';

	let ZeroTask = Backbone.View.extend({

		el: '',

    tagName   : 'div',
    className : 'empty-tasks',
		template  : _.template(template),
    events    : {
		},
		
    initialize: function() {
		},

		render: function () { 	
      this.$el.html(this.template());
      return this;
    },
    
    hide : function(){
      this.$el.hide();
    },
    show : function(){
      this.$el.show();
    }  

	});

	return ZeroTask;
});