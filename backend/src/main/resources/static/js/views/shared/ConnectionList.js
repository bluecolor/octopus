define([
	'underscore',
  'backbone',
  'views/widget/selectlist/SelectList',
  'collections/ConnectionStore'
], function (_, Backbone, SelectList, ConnectionStore) {
	'use strict';

	let ConnectionList = SelectList.extend({


    config: {
      name       : 'connection',
      collection : null,
      label      : 'Connection',
      textProp   : 'name',
      valueProp  : 'id',
      button     : {
        link: '#/connections/new'
      }, 
      typeAhead  : false,
    },
    
		initialize: function(o) {
      
      this.config.collection = ConnectionStore;
      this.config.label      = 'Connection';
      
      if(!_.isEmpty(o)){
        this.config.label = o.label ? o.label :this.config.label;
        this.config.button= o.button? o.button:this.config.button;
      }  
    }

	});

	return ConnectionList;
});