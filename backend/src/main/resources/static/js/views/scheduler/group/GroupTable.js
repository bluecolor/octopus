define([
	'underscore',
  'backbone',
  'text!templates/scheduler/group/html/group-table.html',
  'text!templates/scheduler/group/html/group-record.html',
  'collections/GroupStore',
  'constants/index',
  'plugins/Message',
  'ajax/User'
], function (_, Backbone, template, recordTemplate, GroupStore, Constants, Message, User) {
	'use strict';

  let GroupRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
      return this;
    },
    render: function () { 	
      let record = this.model.toJSON();
      record['priorityName'] = Constants.getPriority(record.priority); 
      this.$el.html(this.template(record));
      
      return this;
    }

  });


	let GroupTable = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-scheduler-group-table',
    template  : _.template(template),
    
    events: {
      'click .js-group-checkbox': 'onCheckbox',
      'click .js-reload-groups' : 'onReload',
      'click .js-trash-btn': 'onDelete',
      'click .js-export-btn': 'onExportGroup',
      'input .js-search': 'onSearch',
    },


		initialize: function() {
      this.config = {
        collection: GroupStore,
      };
      this.listenTo(this.config.collection, 'remove add change reset', function(){
        this.load();
      });
		},

    onSearch: function(e){
      const str = e.target.value,
            groups = GroupStore.search(str);
      this.load(groups);
    },

    onExportGroup: function(){
      const id = this.$el.find('input[type="checkbox"]:checked').val(); 
      window.location = `api/v1/scheduler/groups/export/${id.toString()}`;
    },

    onDelete: function(){
      const me   = this;
      const id   = this.$el.find('input[type="checkbox"]:checked').val();
      const model= GroupStore.get(id);

      model.destroy({
        wait:true,
        success: function(){
          me.$el.find('.js-trash-btn, .js-run-btn').addClass('hidden');
          Message.notifySuccess('Group deleted.');
          GroupStore.remove([model]);
          Backbone.trigger("route",{route: Constants.Route.SCHEDULER_PLANS});
        },
        error: function(){
          Message.notifyDanger('Unable delete group!');
        }  
      });
    },

    load: function(groups){
      const me= this, g = groups || GroupStore.models;
      
      me.$tableBody.empty();
      _.each(g, group => me.addRecord(group));
      me.initAuth();
      me.$el.find('.js-trash-btn, .js-export-btn').addClass('hidden');
    },

		render: function (groups) { 	
      const me = this;
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('.js-group-table-body');

      this.load(groups);

      this.$el.find('.pagination').twbsPagination({
        totalPages  : me.config.collection.state.totalPages,
        visiblePages: 10,
        disableLoad : true,
        onPageClick: function (event, page) {
          if(!this.disableLoad){
            me.config.collection.getPage(page-1);
          }
          this.disableLoad = false;
        }
      });

      return this;
    },

    onReload: function(){
      GroupStore.fetch({reset:true, data:{fetch:true, type:"get"}});
    },
    
    addRecord: function(p){
      let plan = new GroupRecord({model:p});
      this.$tableBody.append(plan.render().el);
    },

    onCheckbox: function(e){
      let r = $(e.target).closest('tr');
      $(e.target).closest('tbody').find('tr').removeClass('selected-record');

      if($(e.target).prop('checked')){
        r.addClass('selected-record');
      }
      let checked = $('.js-group-table-body').find('input[type="checkbox"]:checked');
      if(checked.length == 0){
        this.$el.find('.js-trash-btn, .js-export-btn').addClass('hidden');  
      }else{
        this.$el.find('.js-trash-btn, .js-export-btn').removeClass('hidden');
      }
      this.$el.find('.js-group-checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },

    show: function(){
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.checkbox, .js-new-btn, .js-import-btn').removeClass('hidden');
      }else{
        this.$el.find('.checkbox, .js-new-btn, .js-import-btn').addClass('hidden');
      }
    }

	});

	return GroupTable;
});