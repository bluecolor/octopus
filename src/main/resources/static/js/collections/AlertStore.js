define([
	'underscore',
	'backbone',
  'paginator',
	'models/AlertModel'
], function (_, Backbone, PageableCollection, AlertModel) {
	'use strict';

	let AlertStore = PageableCollection.extend({
    model     : AlertModel,
    url       : '/api/v1/alerts',
		comparator: 'type',
    state: {
      firstPage:0,
      order: 1,
      pageSize: 25
    },
    
    search: function(str){
      if(_.isEmpty(str)) return this.models;

      const pattern = new RegExp(str,"gi");
      return this.filter(function(data) {
        return pattern.test(data.get("tp")) || 
          pattern.test(data.get("msg")) ;
      });
	  }
  });

  return new AlertStore([],{
    mode: "client"
  });

});