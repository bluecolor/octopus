define([
	'underscore',
  'backbone',
  'views/widget/selectlist/SelectList',
  'collections/TechnologyStore'
], function (_, Backbone, SelectList, TechnologyStore) {
	'use strict';

	let TechnologyList = SelectList.extend({
    
		initialize: function(o) {
      
      this.config = {
        collection : TechnologyStore,
        label      : 'Technology',
        textProp   : 'name',
        valueProp  : 'id',
        button     : false, 
        typeAhead  : false,
      };

      if(!_.isEmpty(o)){
        this.config.label = o.label ? o.label :this.config.label;
        this.config.button= o.button? o.button:this.config.button;
      }  
    }

	});

	return TechnologyList;
});