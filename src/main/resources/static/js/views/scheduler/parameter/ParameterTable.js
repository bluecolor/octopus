define([
  'underscore',
  'backbone',
  'text!templates/scheduler/parameter/html/parameter-table.html', 
  'text!templates/scheduler/parameter/html/parameter-record.html',  
  'collections/ParameterStore',
  'plugins/Message',
  'constants/index',
  'ajax/User'
],function(_, Backbone, template, recordTemplate,ParameterStore, Message, Constants, User ){
  'use strict';

  let ParameterRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () { 	
      let record = this.model.toJSON();
      this.$el.html(this.template(record));
      return this;
    }

  });


  let ParameterTable = Backbone.View.extend({

    tagName   : 'section',
    className : 'content',
    template  : _.template(template),
    events: {
      'click .checkbox': 'onCheckbox',
      'click .js-reload-btn': 'onReload',
      'click .js-trash-btn': 'onDelete',
      'click .js-export-btn': 'onExportParameter',
      'input .js-search': 'onSearch',
    },

    initialize: function() {
      this.config = {
        collection: ParameterStore,
      };
      this.listenTo(ParameterStore, 'remove add change reset', function(){
        this.load();
      });
		},

    onSearch: function(e){
      const str = e.target.value,
            parameters = ParameterStore.search(str);
      this.load(parameters);
    },

    onReload: function(){
      ParameterStore.fetch({reset:true, data:{fetch:true, type:"get"}});
      this.$el.find('.js-trash-btn, .js-export-btn').addClass('hidden');  
    },

    onExportParameter: function(){
      const id = _.map(this.$el.find('input[type="checkbox"]:checked'),i=>parseInt($(i).val()));
      window.location = `api/v1/scheduler/parameters/export/${id.toString()}`;
    },

    onDelete: function(){
      const me   = this;
      const id   = this.$el.find('input[type="checkbox"]:checked').val();
      const model= ParameterStore.get(id);

      model.destroy({
        wait:true,
        success: function(){
          me.$el.find('.js-trash-btn, .js-run-btn').addClass('hidden');
          Message.notifySuccess('Parameter deleted.');
          ParameterStore.remove([model]);
        },
        error: function(){
          Message.notifyDanger('Unable delete parameter!');
        }  
      });
    },

    addRecord: function(p){
      let plan = new ParameterRecord({model:p});
      this.$tableBody.append(plan.render().el);
    },

    load: function(parameters){
      const me= this,
            p = parameters || ParameterStore.models;
      this.$tableBody.empty();

      _.each(p, function(parameter){
        me.addRecord(parameter);
      });

      me.initAuth();
      this.$el.find('.js-trash-btn').addClass('hidden');
    },

    onCheckbox: function(e){
      let r = $(e.target).closest('tr');
      $(e.target).closest('tbody').find('tr').removeClass('selected-record');

      if($(e.target).prop('checked')){
        r.addClass('selected-record');
      }
      let checked = $('tbody').find('input[type="checkbox"]:checked');
      if(checked.length == 0){
        this.$el.find('.js-trash-btn, .js-export-btn').addClass('hidden');  
      }else{
        this.$el.find('.js-trash-btn, .js-export-btn').removeClass('hidden');
      }
      this.$el.find('checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },

		render: function (parameters) { 	
      const me = this;
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('tbody');

      this.load(parameters);

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

  return ParameterTable;

});