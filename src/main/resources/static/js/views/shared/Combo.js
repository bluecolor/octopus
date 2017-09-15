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
      'click .js-combo-b1': 'onClear', 
      'click .js-combo-b2': 'onb2'
    },

		initialize: function(o) {
      this.config = {
        name : 'combo',
        store: [],
        label: '',
        valueProp: 'id',
        displayProp: 'name',
        button: {
          cls  : 'fa-plus',
          clear: true,
          onb2 : function(){;}
        },
        typeAhead: false
      };
      this.config = $.extend(true,{},this.config,o);       
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
          options = _.isArray(this.config.store) ? this.config.store: this.config.store.models,
          select  = this.$el.find('select');
      _.each(options, function(option){
        let o = option;
        if(_.isObject(option)){ o = option.attributes; }
        select.append($("<option/>").val(o[me.config.valueProp]).text(o[me.config.displayProp]));
      });  

      return this;
    },

    getValue: function(){
      return this.$el.find('select').val();
    },

    setValue: function(v){
      this.$el.find('select').val(v);
    },


    onClear: function(){
      this.$el.find("select").val([]);
    },

    onb2: function(){
      this.config.button.onb2();
    }

	});


	return Combo;
});