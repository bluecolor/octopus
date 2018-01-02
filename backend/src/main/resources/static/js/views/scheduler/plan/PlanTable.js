define([
	'underscore',
  'backbone',
  'text!templates/scheduler/plan/html/plan-table.html',
  'text!templates/scheduler/plan/html/plan-record.html',
  'collections/index',
  'plugins/Message',
  'ajax/Plan',
  'constants/index'
], function (_, Backbone, template, recordTemplate, Store, Message, AjaxPlan, Constants) {
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
      collection: Store.PlanStore,
    },
    
    events: {
      'input .js-search': 'onSearch',
      'click .js-plan-checkbox' : 'onCheckbox',
      'click .js-reload'        : 'onReload',
      'click .js-run'           : 'onRun',
      'click .js-trash-btn'     : 'onDelete',
      'click .js-export-plan'   : 'onExportPlan',
      'click .js-export-tasks'  : 'onExportTasks',
      'click .js-stats'         : 'onStats',
      'click .js-protect'       : 'onProtect',
      'click .js-un-protect'    : 'onUnProtect',
      'click .js-delete-sessions': 'onDeleteSessions'
    },

		initialize: function() {
      this.listenTo(Store.PlanStore, 'reset change', ()=>{
        console.log('load')
        this.load();
      });
      return this;
    },
    



    onRun: function(){
      const me = this,
            id = this.getSelected(),  
            plan = Store.PlanStore.get(id).attributes;


      const $msg = $(`
        <div class="section">
        <div class="facebox-alert" data-facebox-id="facebox-description" id="facebox-description">
          Configure new session for <strong>${plan.name}</strong>.
        </div>
        <p style="margin-bottom:20px">
          You can give custom <strong>session name</strong> and <strong>schedule date</strong> for the session to be created.
          This will create a new session regardless of the plan parameters like <code>disabled</code> and 
          <code>protected</code>. See <a href="https://github.com/bluecolor/octopus/wiki", target="_blank">documentation</a> for more about "creating sessions".
        </p>
          <div class="form-group">
            <label>Session name</label>
            <input name="name" type="text" class="form-control" autocomplete="off" placeholder="Leave empty for default"/>
          </div>
          <div class="form-group">
            <label>Schedule date</label>
            <input name="scheduleDate" type="text" class="form-control" autocomplete="off" placeholder="Leave empty for default"/>
          </div>
        </div>
      `);

      BootstrapDialog.show({
        type  : BootstrapDialog.TYPE_DEFAULT,  
        title : 'Configure and create session',
        message   : $msg,
        draggable : true,
        autospin  : true,
        closable: true,
        closeByBackdrop: false,
        onshow    : function(dialog){
          $msg.find('input[name="scheduleDate"]').daterangepicker({
              singleDatePicker: true,
              showDropdowns: true,
              timePicker: true,
              timePicker24Hour: true,
              autoUpdateInput: false,
              locale: {
                format: 'MM/DD/YYYY HH:mm',
                cancelLabel: 'Clear'
              }
            }, function(start, end, label) {
              $msg.find('input[name="scheduleDate"]').val(start.format('YYYY-MM-DD HH:mm'));
          }).on('cancel.daterangepicker', function(){
            $msg.find('input[name="scheduleDate"]').val('');
          });
        },
        buttons: [{
          id: 'confirm-btn',
          label: 'Run',
          cssClass: 'btn-block btn-success',
          hotkey: 13,
          action: function(d){
            const name = $msg.find('input[name="name"]').val(),
                  scheduleDate = $msg.find('input[name="scheduleDate"]').val();
            AjaxPlan.createSession(id, {name: name, scheduleDate: scheduleDate}).done(function(s){
              Message.success('Session created for '+plan.name);
              Store.SessionStore.fetch({reset:true, data:{fetch:true, type:"get"}});
            }).always(function(){
              d.close();
            }).fail(function(){
              Message.error('Unable to create session for '+plan.name);    
            });
          }
        }]
      });

    },


    onProtect: function(){
      const id = this.getSelected();  
      AjaxPlan.protect(id).done(function(){
        Store.PlanStore.get(id).set('protect',true);
        Message.success('Plan protected')
      })
    },

    onUnProtect: function(){
      const id = this.getSelected();  
      AjaxPlan.unProtect(id).done(function(){
        Store.PlanStore.get(id).set('protect',false);
        Message.success('Removed plan protection')
      })
    },

    onSearch: function(e){
      const str = e.target.value,
            plans = Store.PlanStore.search(str);
      this.load(plans);
    },

    onStats: function(e){
      const me = this;  
      if(me.popActive) return;

      const id = $(e.target).parent().attr('model-id');
      const plan = Store.PlanStore.get(id).attributes; 
      
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
            p = plans || Store.PlanStore.models;
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
      Store.PlanStore.fetch({reset:true, data:{fetch:true, type:"get"}});
    },

    load: function(plans){
      const me= this,
            p = plans || Store.PlanStore.models;
      this.$tableBody.empty();

      _.each(p, function(plan){
        me.addRecord(plan);
      });
      this.$el.find('.js-trash-btn, .js-more-btn').addClass('hidden');
      this.showHideStats();
    },

    addRecord: function(p){
      let plan = new PlanRecord({model:p});
      this.$tableBody.append(plan.render().el);
    },

    onDelete: function(){
      const me   = this;
      const id   = this.getSelected();
      const model= Store.PlanStore.get(id);

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
                Store.PlanStore.remove([model]);
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

    onDeleteSessions: function(){
      const me = this;
      const id   = this.getSelected();
      const model= Store.PlanStore.get(id);
      
      const o = {
        name: model.get('name'),
        buttonLabel: 'I understand the consequences, delete all sessions',
        action: function(dialog){
          dialog.enableButtons(false);
          dialog.setClosable(false);
          AjaxPlan.deleteSessions(id).done(function(){
            me.$el.find('.js-trash-btn, .js-run-btn, .js-more-btn').addClass('hidden');
            Message.notifySuccess('Sessions deleted.');
          }).fail(function(){
            dialog.enableButtons(true);
            dialog.setClosable(true); 
          }).always(function(){
            dialog.close();
          });
        }
      };

      Message.confirmDanger(o);

    }


	});

	return PlanTable;
});