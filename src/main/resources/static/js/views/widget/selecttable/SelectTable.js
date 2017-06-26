define([
	'underscore',
  'backbone',
  'views/widget/selectlist/SelectList',
  'text!templates/widget/select_table/html/select-table-record.html'
], function (_, Backbone, SelectList, recordTemplate) {
	'use strict';


  let SelectTableRecord = Backbone.View.extend({
    
    tagName   : 'li',
    className : 'list-group-item',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.$el.html(this.template(this.model));
      return this;
    }
  }); 


	let SelectTable = Backbone.View.extend({

		el: '',
    tagName   : 'div',
    className : 'js-select-table-widget',
    events    : {
      'change': 'onChange',
      'click .js-rm-item': 'onRemoveItem',
      'click .js-fav': 'onStarItem'
		},  

    config: {
      collection : null,
      label      : 'Options',
      textProp   : 'name',
      valueProp  : 'id',
      button     : true,  
      value      : []
    },

    onStarItem: function(e){
      
      $(e.target).closest('ul')
      .find('a.js-fav>i')
      .removeClass('fa-star fa-star-o text-yellow text-gray')
      .not(e.target)
      .addClass('fa-star-o text-gray');

      $(e.target).addClass('fa-star text-yellow').removeClass('text-gray');
    },

    getValue: function(){
      return this.config.value;
    },

    removeItem: function(id){
      this.config.value = _.without(this.config.value,id);
      return id;
    },

    onRemoveItem: function(e){
      const id = $(e.target).parent().parent().find('.js-item-name').attr('model-id');
      this.removeItem(parseInt(id));
      this.render();
    },

    onChange: function(e){
      const id = parseInt(e.target.value);
      if(this.config.value.indexOf(id) == -1){
        this.addToTable(id);
      }
    },
    
		initialize: function(o) {

      if(!_.isEmpty(o)){
        this.config.collection = o.collection;
        this.config.label = o.label;
        this.config.button= o.button;
      }  

      let selectOptions = {
        label: this.config.label,
        collection: this.config.collection,
        button: this.config.button
      };

      this.selectList = new SelectList(selectOptions);  
      this.selectList.delegateEvents();
      this.$el.append(this.selectList.render().el);
      this.$list = $('<ul class="list-group"></ul>')
      this.$el.append(this.$list);
    },

    addToTable: function(id){
      const store= this.config.collection,
            model= store.get(id);

      const listItem = new SelectTableRecord({model:_.pick(model.attributes, 'id','name')});     
      this.$list.append(listItem.render().el);
      this.config.value.push(parseInt(id));      
    },

		render: function () { 	
      const me = this, values = this.config.value.slice(0);
      me.$list.empty();
      this.config.value = [];
      _.each(values, function(id){
        me.addToTable(id);
      });
      this.$el.find('select').prop("selectedIndex", -1);
      return me;
    },

    addOptions: function(){
      if(_.isEmpty(this.collection)|| _.isEmpty(this.collection.models)) return;
      
      let me = this,
          options = this.collection.models,
          select  = $(this.$el).find('select');
      
      _.each(options, function(option){
        select.append($("<option />").val(option.get(me.valueProp)).text(option.get(me.textProp)));
      });      
    },

    show: function(){
      $(this.$el).hide();
    },

    hide: function(){
      $(this.$el).show();
    }

	});

	return SelectTable;
});