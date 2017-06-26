define([
	'underscore',
	'backbone',
  'paginator',
	'models/UserModel'
], function (_, Backbone, PageableCollection, UserModel) {
	'use strict';

	let UserStore = PageableCollection.extend({
    model     : UserModel,
    url       : '/api/v1/users',
    comparator: 'username',
    state: {
      firstPage:0,
      order: -1,
      pageSize: 25
    },
    search: function(str){
      if(_.isEmpty(str)) return this.models;

      const pattern = new RegExp(str,"gi");
      return this.filter(function(data) {
        return pattern.test(data.get("name")) || 
          pattern.test(data.get("username"))  ||
          pattern.test(data.get("role"))      ||
          pattern.test(data.get("email"));
      });
	  }
	});

	return new UserStore([],{
    mode: "client"
  });
});