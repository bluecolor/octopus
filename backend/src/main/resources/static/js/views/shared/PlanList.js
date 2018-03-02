define([
	'underscore',
  'backbone',
  'views/widget/selectlist/SelectList',
  'collections/PlanStore'
], function (_, Backbone, SelectList, PlanStore) {
	'use strict';

	let PlanList = SelectList.extend({


    config: {
      name       : 'plan',
      collection : null,
      label      : 'Plan',
      textProp   : 'name',
      valueProp  : 'id',
      button     : {
        link: '#/scheduler/plans/new'
      }, 
      typeAhead  : false,
    },
    
		initialize: function(o) {
      
      this.config.collection = PlanStore;
      this.config.label      = 'Plan';
      
      if(!_.isEmpty(o)){
        this.config.label = o.label ? o.label :this.config.label;
        this.config.button= o.button? o.button:this.config.button;

      }  
    }

	});

	return PlanList;
});