define([
	'underscore',
  'backbone',
  'ajax/Task',
  'collections/TaskStore',
  'views/widget/selectlist/SelectList',
  'text!templates/scheduler/task/html/task-dependency-record.html'
], function (_, Backbone, AjaxTask, TaskStore, SelectList, recordTemplate) {
	'use strict';


  let TaskDependencyRecord = Backbone.View.extend({
    
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


	let TaskDependencies = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : '',
    events    : {
      'change': 'onChange',
      'click .js-rm-item': 'onRemoveItem'
		},  

    removeItem: function(id){
      this.config.value = _.without(this.config.value,id);
      return id;
    },

    onRemoveItem: function(e){
      this.trigger('validate');
      const me=this,id = $(e.target).parent().attr('model-id');
      this.removeItem(parseInt(id));
      const v = _.without(this.config.value,id);
      me.setValue(v);
    },

    onChange: function(e){
      const id = parseInt(e.target.value); 
      if(this.config.value.indexOf(id) == -1){
        this.addToTable(id);
      }
    },
    
		initialize: function() {
      let me = this;

      this.config = {
        value: []
      };

      let selectOptions = {
        label: 'Dependencies',
        typeAhead: {
          placeholder: 'Add tasks...',
          url: 'api/v1/scheduler/tasks/search'
        }
      };

      this.selectList = new SelectList(selectOptions);  
      this.selectList.delegateEvents();
      this.$el.append(this.selectList.render().el);
      this.$list = $('<ul class="list-group"></ul>')
      this.$el.append(this.$list);
      return this;
    },

    addToTable: function(id){
      if(_.isNaN(id)){
        return;
      }
      const me = this;
      AjaxTask.findOne(id).done(function(task){
        const listItem = new TaskDependencyRecord({model:_.pick(task, 'id', 'name')});     
        me.$list.append(listItem.render().el);
        me.config.value.push(parseInt(id));
      });            
    },

    getValue: function(){
      return this.config.value;
    },

    setValue: function(dependencies){
      const me = this;
      this.$list.empty();
      this.config.value = [];
      _.each(dependencies, (d) => me.addToTable(d) );
      return this;
    },

		render: function(){ 	
      const me = this;
      this.$list.empty();
      _.each(this.config.value, (v) => me.addToTable(v) );
      return this;
    },

    show: function(){
      this.$el.hide();
    },

    hide: function(){
      this.$el.show();
    }

	});

	return TaskDependencies;
});