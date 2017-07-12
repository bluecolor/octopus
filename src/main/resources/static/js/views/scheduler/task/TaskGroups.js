define([
	'underscore',
  'backbone',
  'collections/GroupStore',
  'views/widget/selectlist/SelectList',
  'text!templates/scheduler/task/html/task-group-record.html'
], function (_, Backbone,GroupStore, SelectList, recordTemplate) {
	'use strict';


  let TarsGroupRecord = Backbone.View.extend({
    
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


	let TaskGroups = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : '',
    events    : {
      'change': 'onChange',
      'click .js-rm-item': 'onRemoveItem',
      'click .js-fav': 'onStarItem'
    },
    
    initialize: function() {
      let me = this;

      this.config = {
        value: [],
        primaryGroup: null,
        collection: GroupStore
      };


      let selectOptions = {
        label: 'Groups',
        collection: me.config.collection,
        button: '#/scheduler/groups/new'
      };

      this.selectList = new SelectList(selectOptions);  
      this.selectList.delegateEvents();
      this.$el.append(this.selectList.render().el);
      this.$list = $('<ul class="list-group"></ul>')
      this.$el.append(this.$list);
      return this;
    },

    setPrimaryGroup: function(id){
      if(!id ||this.config.value.indexOf(id) < 0){
        if(_.isEmpty(this.config.value)) {
          this.config.primaryGroup = undefined;
          return;
        }
        id = this.config.value[0];
      }
      const el = this.$el.find(`[model-id=${id}]>i`);
      this.onStarItem({target:el.get(0)});
    },

    onStarItem: function(e){
      $(e.target).closest('ul')
      .find('a.js-fav>i')
      .removeClass('fa-star fa-star-o text-yellow text-gray')
      .not(e.target)
      .addClass('fa-star-o text-gray');

      $(e.target).addClass('fa-star text-yellow').removeClass('text-gray');
      
      this.config.primaryGroup = $(e.target).closest('a').attr('model-id');
    },

    getValue: function(){
      return this.config.value;
    },

    getPrimaryGroup: function(){
      return parseInt(this.config.primaryGroup);
    },

    removeItem: function(id){
      this.config.value = _.without(this.config.value,id);
      return id;
    },

    onRemoveItem: function(e){
      const me = this, id = $(e.target).parent().attr('model-id');
      this.removeItem(parseInt(id));
      const groups = GroupStore.where(function(g){
        return me.config.value.indexOf(g.id) > -1;
      });
      me.setValue(_.pluck(groups,'attributes'), me.config.primaryGroup);
    },

    onChange: function(e){
      const id = parseInt(e.target.value); 
      if(this.config.value.indexOf(id) == -1){
        this.addToTable(id);
        if(this.config.value.length == 1){
          this.setPrimaryGroup(id);
        }
      }
    },

    addToTable: function(id){
      const store= this.config.collection,
            model= store.get(id);

      const listItem = new TarsGroupRecord({model:_.pick(model.attributes, 'id','name')});     
      this.$list.append(listItem.render().el);
      this.config.value.push(parseInt(id));      
    },

    setValue: function(groups, primary){
      const me = this;
      this.$list.empty();
      _.each(groups,g => me.addToTable(g));
      this.setPrimaryGroup(primary);
    },

		render: function(){ 	
      return this;
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

	return TaskGroups;
});