define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task/html/task-table.html',
  'text!templates/scheduler/task/html/task-record.html',
  'ajax/Task',
  'collections/index',
  'plugins/Message',
  'views/widget/menu/Menu'
], function (_, Backbone, template, recordTemplate, AjaxTask, Store, Message, Menu) {
	'use strict';

  let TaskRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : 'js-task-record',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () { 	
      const m = this.model.attributes?this.model.attributes:this.model;
      this.$el.html(this.template(m));
      return this;
    }

  });


	let TaskTable = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-scheduler-task-table',
    template  : _.template(template),

    events: {
      'input input[name=search]': 'onSearch',
      'change .js-checkbox'   : 'onCheckbox',
      'click .js-run-task'    : 'onRunTask',
      'click .js-delete-task' : 'onDeleteTask',
      'click .js-reload-btn'  : 'reload',
      'click .js-bookmark'    : 'onBookmark',
      'click .js-stats'       : 'onStats',
      'click .js-dependencies': 'onDependencies',
      'click .js-search-menu a[name="bookmarked"]': 'onFilterBookmarked',
      'click .js-search-menu a[name="myTasks"]'   : 'onFilterMyTasks',
      'click .js-search-menu a[name="disabled"]'  : 'onFilterDisabled',
      'click .js-clear-filter-btn': 'onClearFilter',
      'click .js-disable-task': 'onDisableTask',
      'click .js-enable-task' : 'onEnableTask',
      'click .js-export-task' : 'onExportTask',
      'click .js-duplicate-task': 'onDuplicate',
      'click li[class^="js-sort"]': 'onSort',
    },

    initialize: function(planId) {
      const me = this;
      this.config = {
        collection: Store.TaskStore,
        filters: {
          q: '',
          owner: [],
          plan : [],
          group: [],
          bookmarked: null,
          status: '',
          is:[],
          isNot:[]  
        },
        clearFilters: function(){
          me.config.filters = Object.assign({},me.config.filtersTemplate);  
          me.config.filters.is = me.config.filters.isNot = [];
        }
      };
      this.config.filtersTemplate = _.clone(this.config.filters)
      if(planId){
        this.config.filters.plan = [planId];
      }
      setTimeout(()=>{me.listen();},2000);
		},

    listen: function(){
      this.listenTo(this.config.collection, 'sync', function(){
        this.load();
      });
    },

    onRunTask: function(){
      const id = _.map(this.$el.find('input[type="checkbox"]:checked'),i=>parseInt($(i).val()));
      const promise = AjaxTask.run(id);
      promise.done(()=>{
        Message.success('Running tasks');
      });
    },

    onSort: function(e){
      const cn = e.currentTarget.className;
      switch(cn){
        case 'js-sort-name-asc': 
          Store.TaskStore.setSorting("name", -1, {side: "server", full:true});
          break;
        case 'js-sort-name-desc': 
          Store.TaskStore.setSorting("name", 1,  {side: "server", full:true});
          Store.TaskStore.sort();
          break;
        case 'js-sort-avgd-asc':
          Store.TaskStore.setSorting("avgd", 1,  {side: "server", full:true});
          Store.TaskStore.sort();
          break;
        case 'js-sort-avgd-desc':
          Store.TaskStore.setSorting("avgd", -1,  {side: "server", full:true});
          Store.TaskStore.sort();
          break;
        case 'js-sort-most-crash':
          Store.TaskStore.setSorting("error", -1,  {side: "server", full:true});
          Store.TaskStore.sort();
          break;
        case 'js-sort-least-crash':
          Store.TaskStore.setSorting("error", 1,  {side: "server", full:true});
          Store.TaskStore.sort();
          break;
      }
      Store.TaskStore.fetch({data:{fetch:true, type:"get"}});
    },

    onDuplicate: function(){
      const id = _.map(this.$el.find('input[type="checkbox"]:checked'),i=>parseInt($(i).val()))[0];
      window.location = `#/scheduler/tasks/new/${id}`;
    },

    onExportTask: function(){
      const id = _.map(this.$el.find('input[type="checkbox"]:checked'),i=>parseInt($(i).val()));
      window.location = `api/v1/scheduler/tasks/export/${id.toString()}`;
    },

    onDisableTask: function(){
      const me = this;
      const id = _.map(this.$el.find('input[type="checkbox"]:checked'),i=>parseInt($(i).val()));
      
      AjaxTask.disable(id).done(()=>{
        _.each(id,(i)=>{
          me.config.collection.get(i).set('active',false);  
        });
        Message.notifySuccess(`${id.length} task${id.length>1?'s':''} disabled`);  
        me.$el.find('.dropdown[name="more"]').addClass('hidden');
        me.$el.find('.js-delete-task, .js-selected-tasks').addClass('hidden');
      });
    },

    onEnableTask: function(){
      const me = this;
      const id = _.map(this.$el.find('input[type="checkbox"]:checked'),i=>parseInt($(i).val()));
      
      AjaxTask.enable(id).done(()=>{
        _.each(id,(i)=>{
          me.config.collection.get(i).set('active',true);  
        });
        Message.notifySuccess(`${id.length} task${id.length>1?'s':''} enabled`);  
        me.$el.find('.dropdown[name="more"]').addClass('hidden');
        me.$el.find('.js-delete-task, .js-selected-tasks').addClass('hidden');
      });
    },

    onClearFilter: function(){
      const me=this,ms = ['select[name="owner"]','select[name="group"]','select[name="plan"]' ];

      _.each(ms, function(m){
        const i = me.$el.find(m)
        i.multiselect('deselectAll',false);
        i.multiselect('updateButtonText'); 
      });

      this.config.clearFilters();
      this.reload();
      this.showClearFilter(false);
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

    onFilterBookmarked: function(){
      if(this.config.filters.is.indexOf('bookmarked') == -1){
        this.config.filters.is.push('bookmarked');
        this.filter();
      }
    },

    onFilterDisabled: function(){
      if(this.config.filters.isNot.indexOf('active') == -1){
        this.config.filters.isNot.push('active');
        this.filter();
      }
    },

    onFilterMyTasks: function(){
      if(this.config.filters.is.indexOf('mine') == -1){
        this.config.filters.is.push('mine');
        this.filter();
      }
    },

    filter: function(){
      const me = this;
      this.showClearFilter();  
      const search = me.buildFilters();
      if(_.isEmpty(search)){
        this.showClearFilter(false);  
      }
      return Store.TaskStore.getPage(0,{reset:true, data:{fetch:true, type:"get",search:search}});
    },

    buildFilters: function(){
      const me = this,
        f = me.config.filters;
      return _.chain(me.config.filters).keys().filter((k)=>f[k] != null && !_.isEmpty(f[k])).map((k)=>{
        switch(k){
          case 'q'      : return f[k];
          case 'owner':
          case 'plan' : 
          case 'group': return `${k}:#[${f[k]}]`;
          case 'is'   : return `${k}:${f[k].join(',')}`;
          case 'isNot': return `is!:${f[k].join(',')}`;
        }
        return '';    
      }).join(' ').value().trim();
    },

    reload: function(){  
      const me=this,search = me.buildFilters();
      return Store.TaskStore.getPage(0,{reset:true, data:{fetch:true, type:"get",search:search}});
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
          name: d.name,
          url : `#/scheduler/tasks/${d.id}` 
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

    onStats: function(e){
      const me = this;  
      if(me.popActive) return;

      const id = $(e.target).parent().attr('model-id');
      const task = Store.TaskStore.get(id).attributes; 
      const s = task.stats;
      
      if(!s){
        Message.warning('No stats available for task.');
        return;
      }


      let opts = {
        content: function () {
          let c = `
            <div class="js-popover-content"><canvas class="js-popover-canvas" width="300" height="300"></canvas></div>
          `;                
          return $(c).html();
        },
        trigger: 'manuel',
        html: true,
        container: 'body',
        animation: true,
        placement: 'left'
      };

      me.$pop = $(e.target); 
      me.$pop.popover(opts).popover('show').on('shown.bs.popover',function(){
        me.popActive = true;
        const ctx = $('.js-popover-content');
        const data = {
          datasets: [{
            data: [s.success, s.done, s.error,],
            backgroundColor: [
              'rgba(92, 219, 92, 0.2)',
              'rgba(92, 187, 219, 0.2)',
              'rgba(219, 92, 92, 0.2)'
            ],
            borderColor: [
              'rgba(92, 219, 92, 1)',
              'rgba(92, 187, 219, 1)',
              'rgba(219, 92, 92, 1)'
            ],
            borderWidth: 1
          }],
          labels: [
            'Success',
            'Done',
            'Error',
          ]
        };
        var chart = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: {
            legend: {
              display: false
            }
          }
        });
      });
      $('.popover').css('width',"300px");

      $('body').on('click',function(){
        if(me.popActive) me.$pop.popover('hide');
        me.popActive = false;
      });
    },


    onBookmark: function(e){
      const i = $(e.target);
      if(i.hasClass('fa-bookmark')){
        i.removeClass('fa-bookmark');
        i.removeClass('text-yellow');
        i.addClass('fa-bookmark-o');
        i.addClass('text-gray');
        AjaxTask.unBookmark(i.parent().attr('model-id'));
      }else{
        i.removeClass('fa-bookmark-o');
        i.removeClass('text-gray');
        i.addClass('fa-bookmark');
        i.addClass('text-yellow');
        AjaxTask.bookmark(i.parent().attr('model-id'));
      }
    },

    onDeleteTask: function(){
      const me = this;
      const id   = this.$el.find('input[type="checkbox"]:checked').val();
      const model= this.config.collection.get(id);

      const o = {
        name: model.get('name'),
        buttonLabel: 'I understand the consequences, delete this task',
        action: function(dialog){
          dialog.enableButtons(false);
          dialog.setClosable(false);
          model.destroy({
            wait:true,
            success: function(){
              dialog.close();
              Message.notifySuccess('Task deleted.');
              me.reload();
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
      
      if($(e.target).prop('checked')){
        r.addClass('selected-record');
      }else {
        r.removeClass('selected-record');
      }
      
      let checked = this.$el.find('.js-table-body input[type="checkbox"]:checked');
      
      if(checked.length != 0){
        this.$el.find('.dropdown[name="more"]').removeClass('hidden');
        this.$el.find('.js-selected-tasks').text(
          `${checked.length} task${checked.length>1?'s':''} selected`
        ).removeClass('hidden');
      }else{
        this.$el.find('.dropdown[name="more"]').addClass('hidden');
        this.$el.find('.js-delete-task, .js-selected-tasks').addClass('hidden');
      }

      if(checked.length == 1){
        this.$el.find('.js-delete-task, .js-duplicate-task, .js-task-dep').removeClass('hidden');
      }else if(checked.length > 1){
        this.$el.find('.js-delete-task, .js-duplicate-task, .js-task-dep').addClass('hidden');
      }
    },

    load: function(tasks){
      console.log("load")
      const me= this,
            t = tasks || Store.TaskStore.models;
      this.$tableBody.empty();
      _.each(t, task=>me.addRecord(task) );
      this.$el.find('.js-trash-btn,.js-disable-btn,.js-enable-btn').addClass('hidden');
      this.showHideStats();
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

    initPlanFilter: function(){
      const me= this,select = this.$el.find('select[name="plan"]');
      _.each(_.pluck(Store.PlanStore.models,'attributes'), (plan)=>{
        select.append(`<option value=${plan.id}>${plan.name}</option>`)    
      });
      select.multiselect({
        nonSelectedText: 'Plan',
        allSelectedText: 'All Plans',
        buttonClass: 'btn btn-sm',
        onChange: function(option, checked){
          const plans = _.pluck(select.find('option:selected'), 'value');
          me.config.filters.plan = plans;
          me.filter();
        }
      });
    },


    initFilters: function(){
      this.initOwnerFilter();
      this.initGroupFilter();      
      this.initPlanFilter();
    },

		render: function () { 	
      this.$el.empty();
      this.$el.html(this.template());
      this.initFilters();
      const me= this,
            tasks = this.config.collection.models;
      
      me.initPagination();
            
      this.$tableBody = this.$el.find('.js-table-body');
      
      if(me.config.filters.planId){
        me.filter().done(function(){
          var tasks = me.config.collection.models;
          me.load(tasks);
        });
      }else {
        me.load(tasks);
      }
      
      this.showHideStats();
      return this;
    },

    initPagination: function(){
      const me = this;
      me.$el.find('.pagination').twbsPagination({
        totalPages  : me.config.collection.state.totalPages,
        visiblePages: 10,
        disableLoad : true,
        onPageClick: function (event, page) {
          if(this.disableLoad != null && !this.disableLoad){
            me.config.collection.getPage(page-1);
          }
          this.disableLoad = false;
        }
      });
    },

    showHideStats: function(){
      this.$el.find('a.js-stats i').addClass('text-green-fade').removeClass('text-green'); 
      this.$el.find('tr.js-task-record').hover(function() {  
        $(this).find('a.js-stats i').addClass('text-green').removeClass('text-green-fade');
      }, function() { 
        $(this).find('a.js-stats i').addClass('text-green-fade').removeClass('text-green');
      });
    },

    addRecord: function(t){
      let task = new TaskRecord({model:t});
      this.$tableBody.append(task.render().el);
    },

    show: function(){
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    }

	});

	return TaskTable;
});