define([
	'underscore',
  'backbone',
  'text!templates/user/html/user-table.html',
  'text!templates/user/html/user-record.html',
  'collections/index',
  'plugins/Message',
  'constants/index',
  'ajax/User'
], function (_, Backbone, template, recordTemplate, Store, Message, Constants, User) {
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
      const me = this;
      Store.UserStore.fetch({reset:true, data:{fetch:true, type:"get"}}).done(function(){
        me.initPagination();
      });
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

      this.showHideButtons();  
      this.$el.find('.js-user-checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },

    findChecked: function(){
      return this.$el.find('.js-table-body input[type="checkbox"]:checked');
    },

    showHideButtons: function(){
      const checked = this.findChecked();
      
      if(checked.length!=0){
        this.$el.find('.js-trash-btn').removeClass('hidden');
      }else{
        this.$el.find('.js-trash-btn').addClass('hidden');
      }
    },


    addRecord: function(user){
      let u = new UserRecord({model:user});
      this.$tableBody.append(u.render().el);
    },

    load: function(u){
      const me = this, users = u || Store.UserStore.models
      this.$tableBody.empty();      
      _.each(users, user => me.addRecord(user));
      me.showHideButtons();
    },

		render: function (users) {
      const me = this;
      me.$el.empty();
      me.$el.html(this.template());
      me.$tableBody = this.$el.find('.js-table-body');
      me.load(users); 
      me.initPagination();
      
      const m = Store.SettingStore.find(m => m.get('name')=='MAIL' && m.get('active')=="yes" );
    
      if(m == null || _.isEmpty(m)){
        me.$el.find('.js-warn-btn').removeClass('hidden');
      }else{
        me.$el.find('.js-warn-btn').addClass('hidden');
      }

      me.initAuth();
      return me;  
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
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.MASTER)){
        this.$el.find('.checkbox, .js-new-user, .js-warn-btn').removeClass('hidden');
      }else{
        this.$el.find('.checkbox, .js-new-user, .js-warn-btn').addClass('hidden');
      }
    }

  });
	
  return UserTable;

});