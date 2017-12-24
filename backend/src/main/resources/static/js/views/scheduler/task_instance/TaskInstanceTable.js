define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task_instance/html/task-instance-table.html',
  'text!templates/scheduler/task_instance/html/task-instance-record.html',
  'collections/index',
  'constants/Color',
  'constants/Status',
  'plugins/Message',
  'views/widget/menu/Menu',
  'ajax/TaskInstance'
], function (_, Backbone, template, recordTemplate, Store, Color, Status, Message, Menu, AjaxTaskInstance) {
	'use strict';

  let TaskInstanceRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () {
      let model = this.model.toJSON();
      model.label = Color.getLabelByStatus(model.status);
      model.color = {
        startDate: Color.paintDate(model.startDate),
        endDate:  Color.paintDate(model.endDate)
      };
      model.progress = Status.progress(model); 
      this.$el.html(this.template(model));
      return this;
    }

  });


	let TaskInstanceTable = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-sch-task-instance-table',
    template  : _.template(template),

    events: {
      'click ul.js-sort'    : 'onSort',
      'click .js-clear-filter-btn': 'onClearFilter',
      'click .js-checkbox'  : 'onCheckbox',
      'click .js-reload'    : 'reload',
      'click .js-trash-btn' : 'onDelete',
      'click .js-start-task': 'onStartTask',
      'click .js-dependencies': 'onDependencies',
      'click .js-block-task': 'onBlockTask',
      'click .js-stop-task': 'onStopTask',
      'click .js-done-task': 'onDoneTask',
      'input input[name=search]': 'onSearch',
    },

		initialize: function(session) {
      const me = this;
      me.config = {
        session: session,
        collection: Store.TaskInstanceStore,
        filters: {
          q: '',
          owner  : [],
          group  : [],
          status : [],
          bookmarked: null,
          is     : [],
          isNot  : []  
        },
        clearFilters: function(){
          me.config.filters = Object.assign({},me.config.filtersTemplate)    
          me.config.filters.sessionId = session.id;
          me.config.filters.is = me.config.filters.isNot = [];
        }
      };
      this.config.filtersTemplate = _.clone(this.config.filters)
      
      this.listenTo(Store.TaskInstanceStore, 'sync', ()=>{
        this.load();
      });
      return this;
		},

		render: function (taskInstances) { 	
      this.$el.empty();
      this.$el.html(this.template(this.config));
      this.$tableBody = this.$el.find('.js-table-body');
      this.initFilters();
      this.load(taskInstances);
      this.resetPagination();
      
      return this;
    },

    resetPagination: function(){
      const me = this;
      
      if(me.$el.find('.pagination').data("twbs-pagination")){
        me.$pagination.twbsPagination('destroy');
      }
      
      me.$pagination = me.$el.find('.pagination').twbsPagination({
        totalPages  :  Store.TaskInstanceStore.state.totalPages,
        visiblePages: 10,  
        startPage: 1,
        onPageClick : function (event, page) {
          Store.TaskInstanceStore.getPage(page-1,{reset:true, data:{fetch:true, type:"get"}});
        }
      });

    },

    onSort: function(e){
      const me = this, 
        name = $(e.target).attr('name'), 
        order = parseInt($(e.target).attr('order')); 
      Store.TaskInstanceStore.setSorting(name, order);
      Store.TaskInstanceStore.getPage(0,{reset:true, data:{fetch:true, type:"get"}}).done(function(){
        me.resetPagination();
      });
      
    },


    buildFilters: function(){
      const me = this,
        f = me.config.filters;
      return _.chain(me.config.filters).keys().filter((k)=>f[k] != null && !_.isEmpty(f[k])).map((k)=>{
        switch(k){
          case 'q'      : return f[k];
          case 'status' : return `${k}:[${f[k]}]`;
          case 'owner':
          case 'plan' : 
          case 'group': return `${k}:#[${f[k]}]`;
          case 'is'   : return `${k}:${f[k].join(',')}`;
          case 'isNot': return `is!:${f[k].join(',')}`;
        }
        return '';    
      }).join(' ').value().trim();
    },

    showClearFilter: function(b){
       if(b == undefined || b)
        this.$el.find('.js-clear-filter-btn').removeClass('hidden');
       else 
        this.$el.find('.js-clear-filter-btn').addClass('hidden');
      return this;
    },

    onSearch: function(){
      this.config.filters.q = this.$el.find('input[name=search]').val();
      this.filter();
    },

    filter: function(){
      const me = this;
      this.showClearFilter();  
      const search = me.buildFilters();
      if(_.isEmpty(search)){
        this.showClearFilter(false);  
      }
      return Store.TaskInstanceStore.getPage(0,{reset:true, data:{fetch:true, type:"get",search:search}});
    },

    onClearFilter: function(){
      const me=this,ms = ['select[name="owner"]','select[name="group"]','select[name="status"]' ];

      _.each(ms, function(m){
        const i = me.$el.find(m)
        i.multiselect('deselectAll',false);
        i.multiselect('updateButtonText'); 
      });
      
      this.$el.find('input[name=search]').val('');
      
      this.config.clearFilters();
      this.reload();
      this.showClearFilter(false);
    },
    
    onGroupSelect: function(e){
      const me = this;
      me.config.filters.groupId = $(e.target).attr('model-id')
      me.filter();  
    },

    onStatusSelect: function(e){
      const me = this;
      me.config.filters.status = $(e.target).attr('name').toUpperCase();
      me.filter();  
    },

    onOwnerSelect: function(e){
      const me = this;
      me.config.filters.ownerId = $(e.target).attr('model-id');
      me.filter();  
    },

    load: function(instances){
      const tasks = instances || Store.TaskInstanceStore.models;
      const me = this;
      me.$tableBody.empty();
      _.each(tasks, t => me.addRecord(t));
      this.$el.find('.js-trash-btn,.js-more-btn').addClass('hidden');
      return this;
    },

    getSelected: function(){
      return this.$el.find('input[type="checkbox"]:checked').val();
    },

    onStartTask: function(){
      const me = this;
      const id = this.getSelected();
      const promise = AjaxTaskInstance.start(id);
      promise.done(()=>{
        Message.success('Task will start');
        Store.TaskInstanceStore.get(id).set('status', 'IDLE');
        me.load();
      });
    },

    onDoneTask: function(){
      const me = this;
      const id = this.getSelected();
      const promise = AjaxTaskInstance.done(id);
      promise.done(()=>{
        Message.success('Done task');
        Store.TaskInstanceStore.get(id).set('status', 'DONE');
        me.load();
      });
    },

    onBlockTask: function(){
      const me = this;
      const id = this.getSelected();
      const promise = AjaxTaskInstance.block(id);
      promise.done(()=>{
        Message.success('Blocked task');
        Store.TaskInstanceStore.get(id).set('status', 'BLOCKED');
        me.load();
      });
    },

    onStopTask: function(){
      const me = this;
      const id = this.getSelected();
      const promise = AjaxTaskInstance.stop(id);
      promise.done(()=>{
        Message.success('Killed task');
        Store.TaskInstanceStore.get(id).set('status', 'KILLED');
        me.load();
      });
    },

    onDependencies: function(e){
      const id = parseInt($(e.target).attr('model-id'));
      const deps=this.config.collection.get(id).attributes.dependencies;
      
      if(deps.length == 0){
        return;
      }
      
      let o = {
        items: []
      };

      o.items = _.map(deps,(d)=>{
        return {
          data: d.id,
          name: d.task.name,
          status: d.status,
          url : `#/scheduler/task-instances/${d.id}` 
        };
      });

      let m = new Menu(o);
      this.$el.append(m.el);
      m.$el.css({
        position: "absolute",
        display: "block",
        left: e.pageX,
        top : e.pageY-100
      });  
      
    },


    reload: function(){
      const me=this,search = me.buildFilters();
      return Store.TaskInstanceStore.getPage(0,{reset:true, data:{fetch:true, type:"get",search:search}});
    },

    addRecord: function(p){
      let plan = new TaskInstanceRecord({model:p});
      this.$tableBody.append(plan.render().el);
    },

    onDelete: function(){
      const me   = this;
      const id   = this.getSelected();
      const model= Store.TaskInstanceStore.get(id);

      const o = {
        name: model.get('name'),
        buttonLabel: 'I understand the consequences, delete this task',
        action: function(dialog){
          dialog.enableButtons(false);
          dialog.setClosable(false);
          model.destroy({
              wait:true,
              success: function(){
                me.$el.find('.js-trash-btn, .js-run-btn').addClass('hidden');
                dialog.close();
                Message.notifySuccess('Task deleted.');
                Store.TaskInstanceStore.remove([model]);
              },
              error: function(){
                dialog.enableButtons(true);
                dialog.setClosable(true); 
              }  
          });
        }
      };
      Message.confirmDanger(o); 
    },

    onCheckbox: function(e){
      let r = $(e.target).closest('tr');
      $(e.target).closest('tbody').find('tr').removeClass('selected-record');

      if($(e.target).prop('checked')){
        r.addClass('selected-record');
      }
      
      let checked = this.$el.find('.js-checkbox input[type="checkbox"]:checked');
      
      if(checked.length!=0){
        this.$el.find('.js-trash-btn, .js-run-btn, .js-more-btn').removeClass('hidden');
      }else{
        this.$el.find('.js-trash-btn, .js-run-btn, .js-more-btn').addClass('hidden');
      }
      
      this.$el.find('.js-checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },

    initOwnerFilter: function(){
      const me = this, select = this.$el.find('select[name="owner"]');
      _.each(_.pluck(Store.UserStore.models,'attributes'),  (user)=>{
        select.append(`<option value=${user.id} > ${user.name} </option>`)    
      });
      select.multiselect({
        nonSelectedText: 'Owner',
        allSelectedText: 'All Owners',
        buttonClass: 'btn btn-sm',
        enableHTML: true,
        onChange: function(option, checked){
          const owners = _.pluck(select.find('option:selected'), 'value');
          me.config.filters.owner = owners;
          me.filter();
        }
      });
    },

    initGroupFilter: function(){
      const me= this, select = this.$el.find('select[name="group"]');
      _.each(_.pluck(Store.GroupStore.models,'attributes'), (group)=>{
        select.append(`<option value=${group.id}>${group.name}</option>`)    
      });
      select.multiselect({
        nonSelectedText: 'Group',
        allSelectedText: 'All Groups',
        buttonClass: 'btn btn-sm',
        onChange: function(option, checked){
          const groups = _.pluck(select.find('option:selected'), 'value');
          me.config.filters.group = groups;
          me.filter();
        }
      });
    },

    initStatusFilter: function(){
      const me= this, select = this.$el.find('select[name="status"]');
      
      select.multiselect({
        nonSelectedText: 'Status',
        allSelectedText: 'All Statuses',
        buttonClass: 'btn btn-sm',
        onChange: function(option, checked){
          const status = _.pluck(select.find('option:selected'), 'value');
          me.config.filters.status = status;
          me.filter();
        }
      });
    },


    initFilters: function(){
      this.initOwnerFilter();
      this.initGroupFilter();
      this.initStatusFilter();
    },

	});

	return TaskInstanceTable;
});