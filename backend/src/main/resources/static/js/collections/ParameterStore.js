define([
	'underscore',
	'backbone',
  'paginator',
	'models/ParameterModel'
], function (_, Backbone, PageableCollection, ParameterModel) {
	'use strict';

	let ParameterStore = PageableCollection.extend({
    model     : ParameterModel,
    url       : '/api/v1/scheduler/parameters',
		comparator: 'name',
    
    search: function(str){
      if(_.isEmpty(str)) return this.models;

      const pattern = new RegExp(str,"gi");
      return this.filter(function(data) {
        return pattern.test(data.get("name")) || 
          pattern.test(data.get("value")) ||
          pattern.test(data.get("description"));
      });
	  },
    
    state: {
      firstPage:0,
      order: 1,
      pageSize: 25
    }
  });

  return new ParameterStore([],{
    mode: "client"
  });

});