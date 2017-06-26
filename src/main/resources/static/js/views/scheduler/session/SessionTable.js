define([
	'underscore',
  'backbone',
  'text!templates/scheduler/session/html/session-table.html',
  'text!templates/scheduler/session/html/session-record.html',
  'collections/SessionStore',
  'collections/PlanStore',
  'constants/Color',
  'plugins/Time',
  'plugins/Message'
], function (_, Backbone, template, recordTemplate, SessionStore,PlanStore, Color, Time, Message) {
	'use strict';

  let SessionRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () {
      let model = this.model.toJSON();
      model.label = Color.getLabelByStatus(model.status);
      model.color = {
        startDate: model.startDate ? Color.paintDate(model.startDate) : '' ,
        endDate:  model.endDate ? Color.paintDate(model.endDate): ''
      };
      model.timeDiffHuman = Time.timeDiffHuman(model.startDate,model.endDate);
      model.progress = (model.stats.total == 0) ? 100 : 
        Math.floor(100*(model.stats.success + model.stats.done)/model.stats.total)
      
      this.$el.html(this.template(model));
      return this;
    }

  });


	let SessionTable = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-sch-session-table',
    template  : _.template(template),
    
    
    events: {
      'click .js-checkbox'  : 'onCheckbox',
      'click .js-reload'    : 'onReload',
      'click .js-trash-btn' : 'onDelete',
      'click ul.js-sort'    : 'onSort',
      'click ul.js-plan-filter'   : 'onPlanSelect',
      'click ul.js-status-filter' : 'onStatusSelect',
      'input .js-search'          : 'onSearch',
      'click .js-clear-filter-btn': 'onClearFilter'
    },

		initialize: function() {
      const me = this;
      this.listenTo(SessionStore, 'reset', ()=>{
        console.log('load')
        me.load();
      });

    
      this.config = {
        collection: SessionStore,
        filters: {
          q: '',
          plan: '',
          startDateBegin: moment().subtract(3, 'months').unix(),
          startDateEnd: moment().unix(),
          scheduleDateBegin: '', 
          scheduleDateEnd: '',
          status: ''
        },
        clearFilters: function(){
          me.config.filters = Object.assign({},me.config.filtersTemplate)    
        }
      };
      this.config.filtersTemplate = Object.assign({},this.config.filters)

      return this;
		},

		render: function (sessions) { 	
      this.$el.empty();
      this.$el.html(this.template());

      this.$tableBody = this.$el.find('.js-table-body');
      const me= this,
            s = sessions || SessionStore.models;      
      me.load(s);

      me.resetPagination();

      this.initFilters();
      this.initDatePicker();
      return me;
    },

    onPlanSelect: function(e){
      const me = this;
      me.config.filters.plan = $(e.target).attr('model-id')
      me.filter();  
    },

    onStatusSelect: function(e){
      const me = this;
      me.config.filters.status = $(e.target).attr('name').toUpperCase();
      me.filter();  
    },

    onSearch: function(){
      this.config.filters.q = this.$el.find('.js-search').val();
      this.filter();
    },


    filter: function(){
      const me = this;
      this.showClearFilter();  
      const search = me.buildFilters();
      SessionStore.getPage(0,{reset:true, data:{fetch:true, type:"get",search:search}});
    },

    onClearFilter: function(){
      this.config.clearFilters();
      this.showClearFilter(false);
      SessionStore.getPage(0,{reset:true, data:{fetch:true, type:"get"}});
    },

    buildFilters: function(){
      const me = this,
        f = me.config.filters;
      return _.chain(me.config.filters).keys().filter((k)=>f[k] != null && !_.isEmpty(`${f[k]}`)).map((k)=>{
        switch(k){
          case "q": return f[k];
          case "plan": return `${k}:#${f[k]}`;
          case "status": return `${k}:${f[k]}`
          case "startDateBegin": return `${k}>${f[k]}`  
          case "startDateEnd": return `${k}<${f[k]}`;
        }
        return '';    
      }).join(' ').value().trim();
    },

    initFilters: function(){
      const ul = this.$el.find('.dropdown[name="plan"] ul.dropdown-menu');
      _.each(PlanStore.models,(plan)=>{
        ul.append(`<li><a model-id=${plan.attributes.id} href="javascript:void(0)">${plan.attributes.name}</a></li>`)    
      });
    },

    showClearFilter: function(b){
      if(b == undefined || b)
        this.$el.find('.js-clear-filter-btn').removeClass('hidden');
      else 
        this.$el.find('.js-clear-filter-btn').addClass('hidden');
      return this;
    },

    initDatePicker: function(){
      const me = this,
        start = moment().subtract(3, 'months'),
        end = moment();

      const cb = (start, end) => {
        me.config.filters.startDateBegin = moment(start).unix();
        me.config.filters.startDateEnd = moment(end).unix();
        me.filter();
      }

      me.$el.find('.js-daterangepicker').daterangepicker({
        startDate: start,
        endDate: end,
        autoApply: true,
        autoUpdateInput:true, 
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 days': [moment().subtract(6, 'days'), moment()],
          'Last 30 days': [moment().subtract(29, 'days'), moment()],
          'This month': [moment().startOf('month'), moment().endOf('month')],
          'Last 3 months': [moment().subtract(3, 'months'), moment()],
          'This year': [moment().startOf('year'), moment()],
        }
      }, cb);

      return me;
    },

    load: function(sessions){
      const me= this,
            s = sessions || SessionStore.models;
      this.$tableBody.empty();
      _.each(s, function(session){
        me.addRecord(session);
      });
      me.$el.find('.js-trash-btn').addClass('hidden');
      return me;
    },

    getSelected: function(){
      return this.$el.find('input[type="checkbox"]:checked').val();
    },

    onReload: function(){
      SessionStore.fetch({reset:true, data:{fetch:true, type:"get"}});
    },

    addRecord: function(p){
      let plan = new SessionRecord({model:p});
      this.$tableBody.append(plan.render().el);
    },

    onDelete: function(){
      const me   = this;
      const id   = this.getSelected();
      const model= SessionStore.get(id);

      const o = {
        name: model.get('name'),
        buttonLabel: 'I understand the consequences, delete this session',
        action: function(dialog){
          dialog.enableButtons(false);
          dialog.setClosable(false);
          model.destroy({
              wait:true,
              success: function(){
                me.$el.find('.js-trash-btn, .js-run-btn').addClass('hidden');
                dialog.close();
                Message.notifySuccess('Session deleted.');
                SessionStore.remove([model]);
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

    onSort: function(e){
      const me = this, 
        name = $(e.target).attr('name'), 
        order = parseInt($(e.target).attr('order')); 
      SessionStore.setSorting(name, order);
      SessionStore.getPage(0,{reset:true, data:{fetch:true, type:"get"}}).done(function(){
        me.resetPagination();
      });
      
    },

    resetPagination: function(){
      const me = this;
      
      if(me.$el.find('.pagination').data("twbs-pagination")){
        me.$pagination.twbsPagination('destroy');
      }
      
      me.$pagination = me.$el.find('.pagination').twbsPagination({
        totalPages  :  SessionStore.state.totalPages,
        visiblePages: 10,  
        startPage: 1,
        onPageClick : function (event, page) {
          SessionStore.getPage(page-1,{reset:true, data:{fetch:true, type:"get"}});
        }
      });

    }


	});

	return SessionTable;
});