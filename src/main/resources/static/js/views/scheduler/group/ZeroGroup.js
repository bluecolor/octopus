define([
	'underscore',
  'backbone',
  'text!templates/scheduler/group/html/zero-group.html'
], function (_, Backbone, template) {
	'use strict';

	let ZeroGroup = Backbone.View.extend({

		el: '',

    tagName   : 'div',
    className : 'hidden',
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
      this.$el.addClass('hidden');
    },
    show : function(){
      this.$el.removeClass('hidden');
    }  

	});

	return ZeroGroup;
});