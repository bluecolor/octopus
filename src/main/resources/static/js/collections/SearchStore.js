define([
	'underscore',
	'backbone',
  'paginator', 
	'models/SearchModel'
], function (_, Backbone, PageableCollection, SearchModel) {
	'use strict';

	let SearchStore = PageableCollection.extend({
    model     : SearchModel,
		comparator: 'name',
    name      : 'client',    
    state: {
      totalPages: 10,
      firstPage:0,
      order: 1,
      pageSize: 20
    },

    setQuery: function(q){
      this.url = `api/v1/search?q=${q}`;
      return this;
    }

  });

	  return new SearchStore([],{
      mode: "client"
    });

});