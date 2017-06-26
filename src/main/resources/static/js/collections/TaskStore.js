define([
	'underscore',
	'backbone',
  'paginator',
	'models/TaskModel'
], function (_, Backbone, PageableCollection, TaskModel) {
	'use strict';


	let TaskStore = PageableCollection.extend({
    model     : TaskModel,
    url       : 'api/v1/scheduler/tasks',
		comparator: function(t1, t2) {
      if(this.state.order === 1) {
        return t1.get("name") > t2.get("name") ? -1 : 1;
      }
      return t1.get("name") > t2.get("name") ? 1 : -1;
    },
    parseRecords: function (resp) {
      return resp.content;
    },
    parseState: function(resp){
      const me = this;
      return {
        totalPages: resp.first ? resp.totalPages: me.state.totalPages,
        firstPage : resp.first,
        count     : resp.first ? resp.count: me.state.count 
      };
    },
    state: {
      firstPage:1,
      page: 1,
      pageSize: 5,
      sortKey: 'name',
      order: 1,
      count: 0
    },
    queryParams: {
      currentPage: "page",
      pageSize   : "pageSize",
      sortKey: "sortBy"
    }

	}); 

	return new TaskStore();
});
