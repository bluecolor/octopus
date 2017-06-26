define([
	'underscore',
  'backbone',
  'text!templates/scheduler/plan/html/plan-view.html',
  'constants/Route',
  'views/shared/Import',
  'collections/PlanStore',
  'views/scheduler/plan/ZeroPlan',
  'views/scheduler/plan/PlanTable',
  'views/scheduler/plan/Plan',
  ], function (_, Backbone, template, Route, Import, PlanStore, ZeroPlan, PlanTable, Plan) {
	'use strict';

	let PlanView = Backbone.View.extend({

		
    tagName   : 'section',
    className : 'content js-sch-plan-view',
    template  : _.template(template),
		events    : {
		},

		initialize: function(){
      this.listen();
    },

    listen: function(){
    },

    showPlanTable: function(){      
      this.hideZeroPlan();
      this.hidePlan();
      this.hideImport();
      if(_.isEmpty(PlanStore.models)){
        this.showZeroPlan();
      }else if(!this.planTable){
        this.planTable = new PlanTable();
        this.$el.append(this.planTable.render().el); 
      }
    },

    hidePlanTable: function(){
      if(this.planTable){
        this.planTable.$el.remove();
        this.planTable = null;
      }
    },

    showPlan: function(id){
      this.hideZeroPlan();
      this.hidePlanTable();
      this.hideImport();
      this.plan = new Plan(id);
      this.$el.append(this.plan.render().el);
    },

    hidePlan: function(){
      if(this.plan){
        this.plan.$el.remove();
        this.plan = null;
      }
    },

    showZeroPlan: function(){
      this.hidePlan();
      this.hidePlanTable();
      this.hideImport();
      if(!this.zeroPlan){
        this.zeroPlan = new ZeroPlan();
        this.$el.append(this.zeroPlan.render().el);
      }else {
        this.zeroPlan.$el.show();
      }
    },

    hideZeroPlan: function(){
      if(this.zeroPlan){
        this.zeroPlan.$el.hide();
      }
    },

    showImport: function(){
      this.hideZeroPlan();
      this.hidePlan();
      this.hidePlanTable();
      let cb = () => {
        PlanStore.fetch({reset:true, data:{fetch:true, type:"get"}});
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
        case Route.SCHEDULER_PLANS: 
          this.showPlanTable(); 
          break;
        case Route.SCHEDULER_PLANS_EDIT:
        case Route.SCHEDULER_PLANS_NEW: 
          this.showPlan(o.id); 
          break; 
        case Route.CONNECTIONS_NEW: 
          this.showConnection(); 
          break;  
        case Route.SCHEDULER_PLANS_IMPORT:
          this.showImport(o);
          break;
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    },

		render: function () { 	
      this.$el.html(this.template());
      return this;
    }

	});

	return PlanView;
});