define([
	'underscore',
  'backbone',
  'text!templates/user/html/user-table.html',
  'text!templates/user/html/user-record.html',
  'collections/index',
  'plugins/Message'
], function (_, Backbone, template, recordTemplate, Store, Message) {
	'use strict';

  let UserRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });


	let UserTable = Backbone.View.extend({
    tagName   : 'section',    
    className : 'content js-user-table',
		template  : _.template(template),
    
		events: {
      'click .js-user-checkbox' : 'onCheckbox',
      'click .js-trash-btn'     : 'onDeleteUser',
      'click .js-reload-btn'    : 'onReload',
      'input .js-search'        : 'onSearch',
    },

    initialize: function() {
      const me = this;
      me.config = {
        collection: Store.UserStore,
      };

      this.listenTo(Store.UserStore, 'remove add change reset', function(){
        me.load();
      });

      return this;
    },

    onSearch: function(e){
      const str = e.target.value,
            users = Store.UserStore.search(str);
      this.load(users);
    },

    onReload: function(){
      Store.UserStore.fetch({reset:true, data:{fetch:true, type:"get"}});
    },

    onDeleteUser: function(){
      const id   = this.$el.find('input[type="checkbox"]:checked').val();
      const model= this.config.collection.get(id);
      
      model.destroy({
        wait:true,
        success: function(){
          Message.notifySuccess('User deleted.');
          Store.UserStore.remove([model]);
        },
        error: function(){
          Message.notifySuccess('Unable to delete user.');
        }  
      });

    },

    onCheckbox: function(e){

      let r = $(e.target).closest('tr');
      $(e.target).closest('tbody').find('tr').removeClass('selected-record');

      if($(e.target).prop('checked')){
        r.addClass('selected-record');
      }
      
      let checked = this.$el.find('.js-table-body').find('input[type="checkbox"]:checked');
      
      if(checked.length!=0){
        this.$el.find('.js-trash-btn').removeClass('hidden');
      }else{
        this.$el.find('.js-trash-btn').addClass('hidden');
      }
      
      this.$el.find('.js-user-checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },


    addRecord: function(user){
      let u = new UserRecord({model:user});
      this.$tableBody.append(u.render().el);
    },

    load: function(u){
      const me = this, users = u || Store.UserStore.models
      this.$tableBody.empty();      
      _.each(users, user => me.addRecord(user));
    },

		render: function (users) {
      const me = this;
      me.$el.empty();
      me.$el.html(this.template());
      me.$tableBody = this.$el.find('.js-table-body');
      me.load(users); 
      me.initPagination();
      
      const m = Store.SettingStore.find(m => m.get('name')=='MAIL');
    
      if(m == null || _.isEmpty(m)){
        me.$el.find('.js-warn-btn').removeClass('hidden');
      }else{
        me.$el.find('.js-warn-btn').addClass('hidden');
      }

      return this;  
    },

    initPagination: function(){
      const me = this;
      this.$el.find('.pagination').twbsPagination({
        totalPages  : me.config.collection.state.totalPages,
        visiblePages: 10,
        onPageClick: function (event, page) {
          if(!this.disableLoad){
            me.config.collection.getPage(page-1);
          }
          this.disableLoad = false;
        }
      });
    }

  });
	
  return UserTable;

});