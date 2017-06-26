define([
	'underscore',
  'backbone',
  'text!templates/alert/html/alert-table.html',
  'text!templates/alert/html/alert-record.html',
  'collections/AlertStore',
  'constants/Alert',
  'ajax/TaskInstance',
  'plugins/Message',
], function (_, Backbone, template, recordTemplate, AlertStore, Alert, AjaxTaskInstance, Message) {
	'use strict';

  let AlertRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () {
      let m = this.model.toJSON();
      m.objtpHuman = Alert.objtpHuman(m.objtp);
      m.alertDate  = moment(m.obj.startDate).format("HH:mm:ss dddd");
      this.$el.html(this.template(m));
      return this;
    }
  });


	let AlertTable = Backbone.View.extend({
    tagName   : 'section',    
    className : 'content js-alert-table',
		template  : _.template(template),
    
		events: {
      'click .js-reload-btn': 'onReload',
      'click a[name="run"]' : 'onRun',
      'click a[name="done"]': 'onDone',
      'input .js-search': 'onSearch',
    },

    initialize: function() {
      const me = this;
      me.config = {
        collection: AlertStore,
      };

      this.listenTo(AlertStore, 'remove add change reset', function(){
        me.load();
      });

      return this;
    },

    onSearch: function(e){
      const str = e.target.value,
            alerts = AlertStore.search(str);
      this.load(alerts);
    },

    onRun: function(e){
      const me = this, id = $(e.target).parents('td').attr('obj-id');
      $(e.target).closest('spinner').removeClass('hidden');
      AjaxTaskInstance.start(id).done(()=>{
        Message.success('Running task.');
        $(e.target).closest('spinner').addClass('hidden');
      }).always(()=>{
        me.onReload();
      });
    },
    onDone: function(e){
      const me = this, id = $(e.target).parents('td').attr('obj-id');
      $(e.target).closest('spinner').removeClass('hidden');
      AjaxTaskInstance.done(id).done(()=>{
        Message.success('Task marked as done');
        $(e.target).closest('spinner').addClass('hidden');
      }).always(()=>{
        me.onReload();
      });
    },
    onReload: function(){
      AlertStore.fetch({reset:true, data:{fetch:true, type:"get"}});
    },

    addRecord: function(alert){
      let u = new AlertRecord({model:alert});
      this.$tableBody.append(u.render().el);
    },

    load: function(a){
      const me = this,
        alerts = a || AlertStore.models

      this.$tableBody.empty();      
      _.each(alerts, function(a){
        me.addRecord(a);
      });
    },

		render: function (alerts) {
      const me = this;
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('.js-table-body');
      this.load(alerts); 

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
    }

  });
	
  return AlertTable;

});