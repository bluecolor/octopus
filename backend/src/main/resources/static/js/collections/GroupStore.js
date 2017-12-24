define([
	'underscore',
	'backbone',
  'paginator',
	'models/GroupModel'
], function (_, Backbone, PageableCollection, GroupModel) {
	'use strict';

	let GroupStore = PageableCollection.extend({
    model     : GroupModel,
    url       : '/api/v1/scheduler/groups',
		comparator: 'name',
    search: function(str){
      if(_.isEmpty(str)) return this.models;

      const pattern = new RegExp(str,"gi");
      return this.filter(function(data) {
        return pattern.test(data.get("name")) || 
          pattern.test(data.get("description"));
      });
	  },
    state: {
      firstPage:0,
      order: 1,
      pageSize: 25
    }
  });

  return new GroupStore([],{
    mode: "client"
  });

});