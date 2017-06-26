define([
	'underscore',
  'backbone',
  'text!templates/widget/combo/html/combo.html',
], function (_, Backbone, template) {
	'use strict';

	let Combo = Backbone.View.extend({
    
    tagName   : 'div',
    className : 'form-group input-group combo',
		template  : _.template(template),

    events    : {
      'click .js-clear-btn': 'onClear' 
    },

		initialize: function(o) {
      this.config = {
        name : 'combo',
        store: [],
        label: '',
        valueProp: 'id',
        displayProp: 'name',
        button: null,
        typeAhead: false
      };
      this.config = _.extend(this.config,o);       
      this.render();
      return this;
    },

    render: function() { 	
      this.$el.html(this.template(this.config));
      this.loadOptions();
      return this;
    },

    loadOptions: function(){
      if(_.isEmpty(this.config.store) || this.config.store == null){ return; }
      
      let me = this,
          options = this.config.store.models,
          select  = this.$el.find('select');
      _.each(options, function(option){
        let o = option;
        if(_.isObject(option)){ o = option.attributes; }
        select.append($("<option/>").val(o[me.config.valueProp]).text(o[me.config.displayProp]));
      });  

      return this;
    },


    onClear: function(){
      this.$el.find("select").val([]);
    }

	});


	return Combo;
});