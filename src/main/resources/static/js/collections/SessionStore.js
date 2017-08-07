define([
	'underscore',
	'backbone',
  'paginator',
	'models/SessionModel'
], function (_, Backbone, PageableCollection, SessionModel) {
	'use strict';

	let SessionStore = PageableCollection.extend({
    model     : SessionModel,
    url       : '/api/v1/scheduler/sessions',
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
      page: 0,
      pageSize: 25,
      sortKey: 'status',
      order: -1,
      count: 0
    },
    queryParams: {
      currentPage: "page",
      pageSize   : "pageSize",
      sortKey    : "sortBy"
    }
	});

	return new SessionStore([],{
    mode: "server"
  });
});