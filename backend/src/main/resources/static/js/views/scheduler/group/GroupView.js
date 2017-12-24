define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/shared/Import',
  'collections/GroupStore',
  'views/scheduler/group/ZeroGroup',
  'views/scheduler/group/Group',
  'views/scheduler/group/GroupTable',
], function (_, Backbone, Route, Import, GroupStore, ZeroGroup, Group, GroupTable) {
	'use strict';

	let GroupView = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-group-view',
    events    : {
		},

		initialize: function() {
		},

		render: function () { 	
      return this;
    },

    showGroupTable: function(){
      this.hideZeroGroup();
      this.hideGroup();
      this.hideImport();
      if(_.isEmpty(GroupStore.models)){
        this.showZeroGroup();
      }else{
        if(!this.groupTable){
          this.groupTable = new GroupTable();
          this.$el.append(this.groupTable.render().el);
        }else {
          this.groupTable.$el.show();
        }  
      }
    },

    hideGroupTable: function(){
      if(this.groupTable){
        this.groupTable.hide(); 
      }
    },
    
    showGroup: function(id){
      this.hideZeroGroup();
      this.hideGroupTable();
      this.hideImport();
      if(!this.group){
        this.group = new Group();
        this.$el.append(this.group.render().el);
      }
      this.group.show(id);
    },

    hideGroup: function(){
      if(this.group){
        this.group.$el.remove();
        this.group = null;
      }
    },

    hideZeroGroup: function(){
      if(this.zeroGroup){
        this.zeroGroup.hide();
      }
    },

    showZeroGroup: function(){
      this.hideGroup();
      this.hideGroupTable();
      this.hideZeroGroup();
      this.hideImport();
      if(!this.zeroGroup){
        this.zeroGroup = new ZeroGroup();
        this.$el.append(this.zeroGroup.render().el);
      }
      this.zeroGroup.show();
    },

    showImport: function(){
      this.hideZeroGroup();
      this.hideGroup();
      this.hideGroupTable();
      let cb = () => {
        GroupStore.fetch({reset:true, data:{fetch:true, type:"get"}});
      };
      this.import = new Import({cb:cb});
      this.$el.append(this.import.render().el);
    },

    hideImport: function(){
      if(this.import){
        this.import.$el.remove();
        this.import = null;
      }
    },



    show: function(o){
      switch(o.route){
        case Route.SCHEDULER_GROUPS: 
          this.showGroupTable(); 
          break;
        case Route.SCHEDULER_GROUPS_NEW: 
          this.showGroup();  
          break;  
        case Route.SCHEDULER_GROUPS_EDIT: 
          this.showGroup(o.id);  
          break;
        case Route.SCHEDULER_GROUPS_IMPORT: 
          this.showImport(o);  
          break;
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    }

	});

	return GroupView;
});