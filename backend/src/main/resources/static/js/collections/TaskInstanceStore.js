define([
	'underscore',
	'backbone',
  'paginator',
	'models/TaskInstanceModel'
], function (_, Backbone, PageableCollection, TaskInstanceModel) {
	'use strict';


	let TaskInstanceStore = PageableCollection.extend({
    
    model     : TaskInstanceModel,
    url       : '/api/v1/scheduler/task-instances',
		mode      : 'server',
    parseRecords: function (resp) {
      return resp.content;
    },
    
    parseState: function(resp){
      
      return {
        totalPages: resp.totalPages,
        firstPage : resp.first  
      };
    },
    state: {
      firstPage:0,
      order: -1,
      pageSize: 25,
      sortKey: 'name',
    },
    queryParams: {
      currentPage: "page",
      pageSize   : "pageSize",
      totalPages : null,
      sortKey: "sortBy",
      directions: {
        "-1": "asc",
        "1": "desc"
      }
    },
    setSession: function(id){
      this.url = `/api/v1/scheduler/task-instances?session=${id}`
      return this;
    }
	});

	return new TaskInstanceStore();
  
});