define([
	'underscore',
  'backbone',
  'constants/Route',
  'views/shared/Import',
  'collections/ParameterStore',
  'views/scheduler/parameter/ParameterTable',
  'views/scheduler/parameter/ZeroParameter',
  'views/scheduler/parameter/Parameter',
], function (_, Backbone,RouteConstants, Import, ParameterStore, ParameterTable, ZeroParameter, Parameter) {
	'use strict';

	let ParameterView = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-parameter-view',
    
    events    : {
		},

		initialize: function () {
    },

		render: function () { 	
      return this;
    },
    
    showZeroParameter: function(){
      this.zeroParameter = new ZeroParameter();
      this.$el.append(this.zeroParameter.render().el);
    },

    hideZeroParameter: function(){
      if(this.zeroParameter){
        this.zeroParameter.$el.remove();
      }
    },

    showParameterTable: function(){
      this.hideZeroParameter();
      this.hideParameter();
      this.hideImport();
      if(_.isEmpty(ParameterStore.models)){
        this.showZeroParameter();
      }else{
        this.parameterTable = new ParameterTable();
        this.$el.append(this.parameterTable.render().el);  
      }
    },

    hideParameterTable: function(){
      if(this.parameterTable){
        this.parameterTable.$el.remove();
        this.parameterTable= null;
      }
    },

    showParameter: function(o){
      this.hideParameterTable();
      this.hideZeroParameter();
      this.hideImport();
      this.parameter = new Parameter();
      this.$el.append(this.parameter.render().el);
      this.parameter.setValues(o.id);
    },

    hideParameter: function(){
      if(this.parameter){
        this.parameter.$el.remove();
        this.parameter = null;
      }
    },

    showImport: function(){
      this.hideParameterTable();
      this.hideZeroParameter();
      this.hideParameter();
      let cb = () => {
        ParameterStore.fetch({reset:true, data:{fetch:true, type:"get"}});
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
        case RouteConstants.SCHEDULER_PARAMETERS_EDIT:
        case RouteConstants.SCHEDULER_PARAMETERS_NEW:
          this.showParameter(o);
          break;
        case RouteConstants.SCHEDULER_PARAMETERS:
          this.showParameterTable(o);
          break;
        case RouteConstants.SCHEDULER_PARAMETERS:
          this.showParameterTable(o);
          break;
        case RouteConstants.SCHEDULER_PARAMETERS_IMPORT:
          this.showImport(o);
          break;
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.remove();
    }


	});

	return ParameterView;
});