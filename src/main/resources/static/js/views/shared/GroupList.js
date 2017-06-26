define([
	'underscore',
  'backbone',
  'views/widget/selectlist/SelectList',
  'collections/GroupStore'
], function (_, Backbone, SelectList, GroupStore) {
	'use strict';

	let GroupList = SelectList.extend({


    config: {
      collection : GroupStore,
      label      : 'Group',
      textProp   : 'name',
      valueProp  : 'id',
      button     : {
        link: '#/scheduler/groups/new'
      }, 
      typeAhead  : false,
    },
    
		initialize: function(o) {
      
      if(!_.isEmpty(o)){
        this.config.label = o.label ? o.label :this.config.label;
        this.config.button= o.button? o.button:this.config.button;

      }  
    }

	});

	return GroupList;
});