define([
	'underscore',
  'backbone',
  'text!templates/scheduler/plan/html/plan-table.html',
  'text!templates/scheduler/plan/html/plan-record.html',
  'collections/PlanStore',
  'plugins/Message',
  'ajax/Plan',
  'constants/index'
], function (_, Backbone, template, recordTemplate, PlanStore, Message, AjaxPlan, Constants) {
	'use strict';

  let PlanRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : 'js-plan-record',
    template  : _.template(recordTemplate),
    initialize: function(){
      this.listenTo(this.model, 'change',  this.render);
			this.listenTo(this.model, 'destroy', this.remove);
    },
    render: function () { 	
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });


	let PlanTable = Backbone.View.extend({

    tagName   : 'section',
    className : 'content js-sch-plan-table',
    template  : _.template(template),
    events    : {
		},
    
    config: {
      collection: PlanStore,
    },
    
    events: {
      'input .js-search': 'onSearch',
      'click .js-plan-checkbox' : 'onCheckbox',
      'click .js-reload'        : 'onReload',
      'click .js-trash-btn'     : 'onDelete',
      'click .js-export-plan'   : 'onExportPlan',
      'click .js-export-tasks'  : 'onExportTasks',
      'click .js-stats'         : 'onStats',
      'click .js-protect'       : 'onProtect',
      'click .js-un-protect'    : 'onUnProtect'
    },

		initialize: function() {
      this.listenTo(PlanStore, 'reset change', ()=>{
        console.log('load')
        this.load();
      });
      return this;
		},

    onProtect: function(){
      const id = this.getSelected();  
      AjaxPlan.protect(id).done(function(){
        PlanStore.get(id).set('protect',true);
        Message.success('Plan protected')
      })
    },

    onUnProtect: function(){
      const id = this.getSelected();  
      AjaxPlan.unProtect(id).done(function(){
        PlanStore.get(id).set('protect',false);
        Message.success('Removed plan protection')
      })
    },

    onSearch: function(e){
      const str = e.target.value,
            plans = PlanStore.search(str);
      this.load(plans);
    },

    onStats: function(e){
      const me = this;  
      if(me.popActive) return;

      const id = $(e.target).parent().attr('model-id');
      const plan = PlanStore.get(id).attributes; 
      
      let opts = {
        content: function () {
          let c = `
            <div class="js-popover-content">
              <table style="width:100%">
                <tr> <td># of tasks </td> <td style="text-align: right;">${plan.stats.taskCount} </td> </tr>
                <tr> <td># of groups</td> <td style="text-align: right;">${plan.stats.groupCount}</td> </tr>
                <tr> 
                  <td>Avg. duration</td> 
                  <td style="text-align: right;">
                    ${moment.duration(plan.stats.avgDuration,'seconds').format("m [min], s [sec]") }
                  </td>
                </tr>
                <tr>
                  <td>Max. duration</td> 
                  <td style="text-align: right;">
                    ${moment.duration(plan.stats.maxDuration,'seconds').format("m [min], s [sec]") }
                  </td>
                </tr>
                <tr>
                  <td>Min. duration</td> 
                  <td style="text-align: right;">
                    ${moment.duration(plan.stats.minDuration,'seconds').format("m [min], s [sec]") }
                  </td> 
                </tr>
              </table>
            </div>
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
      });
      $('.popover').css('width',"300px");

      $('body').on('click',function(){
        if(me.popActive) me.$pop.popover('hide');
        me.popActive = false;
      });
    },

		render: function (plans) { 	
      this.$el.empty();
      this.$el.html(this.template());

      this.$tableBody = this.$el.find('.js-plan-table-body');
      const me= this,
            p = plans || PlanStore.models;
      me.load(p);

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

    getSelected: function(){
      return this.$el.find('input[type="checkbox"]:checked').val();
    },

    showHideStats: function(){

      this.$el.find('a.js-stats i').addClass('text-green-fade').removeClass('text-green'); 
      this.$el.find('tr.js-plan-record').hover(function() {  
        $(this).find('a.js-stats i').addClass('text-green').removeClass('text-green-fade');
      }, function() { 
        $(this).find('a.js-stats i').addClass('text-green-fade').removeClass('text-green');
      });
    },

    onExportTasks: function(){
      const id = this.getSelected();
      window.location = `api/v1/scheduler/plans/export-tasks/${id.toString()}`;
    },

    onExportPlan: function(){ 
      const id = this.getSelected();
      window.location = `api/v1/scheduler/plans/export/${id.toString()}`;
    },

    onReload: function(){
      PlanStore.fetch({reset:true, data:{fetch:true, type:"get"}});
    },

    load: function(plans){
      const me= this,
            p = plans || PlanStore.models;
      this.$tableBody.empty();

      _.each(p, function(plan){
        me.addRecord(plan);
      });
      this.$el.find('.js-trash-btn').addClass('hidden');
      this.showHideStats();
    },

    addRecord: function(p){
      let plan = new PlanRecord({model:p});
      this.$tableBody.append(plan.render().el);
    },

    onDelete: function(){
      const me   = this;
      const id   = this.getSelected();
      const model= PlanStore.get(id);

      const o = {
        name: model.get('name'),
        buttonLabel: 'I understand the consequences, delete this plan',
        action: function(dialog){
          dialog.enableButtons(false);
          dialog.setClosable(false);
          model.destroy({
              wait:true,
              success: function(){
                me.$el.find('.js-trash-btn, .js-run-btn').addClass('hidden');
                dialog.close();
                Message.notifySuccess('Plan deleted.');
                PlanStore.remove([model]);
                Backbone.trigger("route",{route: Constants.Route.SCHEDULER_PLANS});
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
      
      let checked = $('.js-plan-table-body').find('input[type="checkbox"]:checked');
      
      if(checked.length!=0){
        this.$el.find('.js-trash-btn, .js-run-btn, .js-export-btn, .js-more-btn').removeClass('hidden');
      }else{
        this.$el.find('.js-trash-btn, .js-run-btn, .js-export-btn, .js-more-btn').addClass('hidden');
      }
      
      $('.js-plan-checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },


	});

	return PlanTable;
});