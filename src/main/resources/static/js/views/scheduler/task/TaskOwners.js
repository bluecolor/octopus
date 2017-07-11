define([
	'underscore',
  'backbone',
  'ajax/User',
  'collections/UserStore',
  'views/widget/selectlist/SelectList',
  'text!templates/scheduler/task/html/task-owner-record.html'
], function (_, Backbone, AjaxUser, UserStore, SelectList, recordTemplate) {
	'use strict';


  let TaskOwnerRecord = Backbone.View.extend({
    
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


	let TaskOwners = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : '',
    events    : {
      'change': 'onChange',
      'click .js-rm-item': 'onRemoveItem',
      'click .js-fav': 'onStarItem'
		},  

    setPrimaryOwner: function(id){
      if(!id ||this.config.value.indexOf(id) < 0){
        if(_.isEmpty(this.config.value)) {
          this.config.primaryOwner = undefined;
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
      
      this.config.primaryOwner = $(e.target).closest('a').attr('model-id');
    },

    getValue: function(){
      return this.config.value;
    },

    getPrimaryOwner: function(){
      return parseInt(this.config.primaryOwner);
    },

    removeItem: function(id){
      this.config.value = _.without(this.config.value,id);
      return id;
    },

    onRemoveItem: function(e){
      const me = this, id = $(e.target).parent().attr('model-id');
      this.removeItem(parseInt(id));
      const users = UserStore.where(function(u){
        return me.config.value.indexOf(u.id) > -1;
      })
      
      me.setValue(_.pluck(users,'attributes'), me.config.primaryOwner);
    },

    onChange: function(e){
      const id = parseInt(e.target.value); 
      if(this.config.value.indexOf(id) == -1){
        this.addToTable(id);
        if(this.config.value.length == 1){
          this.setPrimaryOwner(id);
        }
      }
    },
    
		initialize: function() {
      let me = this;

      this.config = {
        value: [],
        primaryOwner: null,
        collection: UserStore
      };


      let selectOptions = {
        label: 'Users',
        collection: {
          models:me.config.collection.filter(function(m){
            return m.get('system') != true;
          })
        },
        button: false
      };

      this.selectList = new SelectList(selectOptions);  
      this.selectList.delegateEvents();
      this.$el.append(this.selectList.render().el);
      this.$list = $('<ul class="list-group"></ul>')
      this.$el.append(this.$list);
      return this;
    },

    addToTable: function(id){
      const store= this.config.collection,
            model= store.get(id);

      const listItem = new TaskOwnerRecord({model:_.pick(model.attributes, 'id','username', 'name')});     
      this.$list.append(listItem.render().el);
      this.config.value.push(parseInt(id));      
    },

    setValue: function(users, primary){
      const me = this;
      this.$list.empty();
      _.each(users, u => me.addToTable(u));
      this.setPrimaryOwner(primary);
    },

    addCurrentUser: function(){
      const me = this;
      AjaxUser.findCurrentUser().done((user)=>{
        let userId = user.id;
        me.setValue([userId],userId);
      });
    },

		render: function(){ 	
      return this;
    }

	});

	return TaskOwners;
});