define([
	'underscore',
	'backbone',
  'paginator',
	'models/ConnectionModel'
], function (_, Backbone, PageableCollection, ConnectionModel, Message) {
	'use strict';

	let ConnectionStore = PageableCollection.extend({
		
    url   : '/api/v1/connections',
    model : ConnectionModel,
    
		comparator: 'name',

    search: function(str){
      if(_.isEmpty(str)) return this.models;

      const pattern = new RegExp(str,"gi");
      return this.filter(function(data) {
        return pattern.test(data.get("name")) || 
          pattern.test(data.get("host"))      ||
          pattern.test(data.get("connectionType"));
      });
	  }

	});


	return new ConnectionStore([],{
    mode: "client",
    state: {
      pageSize: 25,
      sortKey : "name",
      order: 1
    }
  });
});
