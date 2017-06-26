define([
	'underscore',
	'backbone',
  'paginator',
	'models/PlanModel'
], function (_, Backbone, PageableCollection, PlanModel) {
	'use strict';

	let PlanStore = PageableCollection.extend({
    model     : PlanModel,
    url       : '/api/v1/scheduler/plans',
		comparator: 'name',
    state: {
      firstPage:0,
      order: 1,
      pageSize: 25
    },
    search: function(str){
      if(_.isEmpty(str)) return this.models;

      const pattern = new RegExp(str,"gi");
      return this.filter(function(data) {
        return pattern.test(data.get("name")) ||
          pattern.test(data.get("schedule")) || 
          pattern.test(data.get("description"));
      });
	  }
  });

  return new PlanStore([],{
    mode: "client"
  });

});