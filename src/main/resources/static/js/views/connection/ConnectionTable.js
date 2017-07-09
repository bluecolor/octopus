define([
	'underscore',
  'backbone',
  'text!templates/connections/html/connection-table.html',
  'text!templates/connections/html/connection-record.html',
  'collections/ConnectionStore',
  'ajax/Connection',
  'plugins/Message',
  'ajax/User',
  'constants/index'
], function (_, Backbone, template, recordTemplate, ConnectionStore,AjaxConnection, Message, User, Constants) {
	'use strict';

  let ConnectionRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(recordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });


	let ConnectionTable = Backbone.View.extend({
    tagName   : 'section',    
    className : 'content js-connections-view',
		template  : _.template(template),

    config: {
      collection: ConnectionStore,
    },

    
		events: {
      'click .js-connection-checkbox': 'onCheckbox',
      'click .js-trash-btn': 'onDeleteConnection',
      'click .js-reload-btn': 'onReload',
      'click .js-connections-next': 'onNextPage',
      'click .js-connections-prev': 'onPrevPage',
      'input .js-search-connections': 'onSearchConnections',
      'click .js-test-btn': 'onTest',
      'click .js-export-btn': 'onExport'
    },
    
    onExport: function(){
      const id = this.$el.find('input[type="checkbox"]:checked').val();
      window.location = `api/v1/connections/export/${id}`;
    },

    selected: function(){
      return this.$el.find('input[type="checkbox"]:checked').val()
    },

    onTest: function(){

      let id = this.selected(), me = this,
          model= ConnectionStore.get(id), cb = {};

      cb.success = () => {
        model.status = 1;
        me.load();
      };   

      cb.error = () => {
        model.status = -1;
        me.load();
      };

      AjaxConnection.test(model.attributes, cb);
    },

    onSearchConnections: function(e){
      const str = e.target.value,
            connections = ConnectionStore.search(str);
      this.reload(connections);
    },

    onPrevPage: function(){
      if(ConnectionStore.hasPreviousPage()){
        ConnectionStore.getPreviousPage();
        this.checkPagination();
      }
    },

    onNextPage: function(){
      if(ConnectionStore.hasNextPage()){
        ConnectionStore.getNextPage();
        this.checkPagination();
      }
    },

    onReload: function(){
      ConnectionStore.fetch({reset:true, data:{fetch:true, type:"get"}});
      this.$el.find('.js-trash-btn, .js-test-btn, .js-export-btn').addClass('hidden');
    },

    onDeleteConnection: function(){
      let id   = this.$el.find('input[type="checkbox"]:checked').val(),
          model= ConnectionStore.get(id),
          name = model.get('name');
      
      let $message = $(`
        <div class="form-group">
        <div class="facebox-alert" data-facebox-id="facebox-description" id="facebox-description">
          Unexpected bad things will happen if you don’t read this!
        </div>
        <p style="margin-bottom:20px">This action <strong>CANNOT</strong> be undone. 
          This will permanently delete the <strong>${name}</strong> 
          connection and all the objects, that are directly or indirectly related, to this connection.
        </p>
        <input name="name" type="text" required="required" class="form-control" autocomplete="off"/>
        </div>
      `);
      
      BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DEFAULT,  
        title: 'Are you ABSOLUTELY sure?',
        message: $message,
        draggable: true,
        autospin: true,
        onshow: function(dialog){
          let b = dialog.getButton('delete-confirm-btn');
          b.disable();
          $message.find('input[name="name"]').on('input', function(){
            if(this.value == name){
              b.enable();
            }else{
              b.disable();
            }
          });
        },
        buttons: [{
          id: 'delete-confirm-btn',
          label: 'I understand the consequences, delete this connection',
          cssClass: 'btn-block btn-danger',
          hotkey: 13,
          action: function(dialog) {
            dialog.enableButtons(false);
            dialog.setClosable(false);
            model.destroy({
              wait:true,
              success: function(){
                dialog.close();
                ConnectionStore.remove(id);
                Message.success('Connection deleted.');
                Backbone.trigger("route",{route: Constants.Route.CONNECTIONS});

              },
              error: function(){
                dialog.enableButtons(true);
                dialog.setClosable(true); 
              }  
            });

          }
        }]
      });
    },

    onCheckbox: function(e){

      let r = $(e.target).closest('tr');
      $(e.target).closest('tbody').find('tr').removeClass('selected-record');

      if($(e.target).prop('checked')){
        r.addClass('selected-record');
      }
      
      let checked = $('.js-connection-table-body').find('input[type="checkbox"]:checked');
      
      if(checked.length!=0){
        this.$el.find('.js-trash-btn, .js-test-btn, .js-export-btn').removeClass('hidden');
      }else{
        this.$el.find('.js-trash-btn, .js-test-btn, .js-export-btn').addClass('hidden');
      }
      
      $('.js-connection-checkbox input[type="checkbox"]').not(e.target).prop('checked', false);
    },


    reload: function(connections){
      const cons = connections || ConnectionStore.models;
      this.load(cons);
    },

    load: function(connections){
      const me = this,
            cons = connections || ConnectionStore.models;
    
      this.$tableBody.empty();      

      _.each(cons, c => me.addRecord(c));
      me.initAuth();
      this.checkPagination();
    },

		initialize: function() {
      const me = this;
      this.render();
      this.$tableBody = $(this.$el.find('.js-connection-table-body')[0]);
      this.load();
      this.listenTo(ConnectionStore, 'reset add remove', function(){
        me.reload();
      });
      return this;
    },

    checkPagination: function(){
      this.$el.find('.js-connections-next').prop('disabled',!ConnectionStore.hasNextPage());
      this.$el.find('.js-connections-prev').prop('disabled',!ConnectionStore.hasPreviousPage());
    },

    addRecord: function(connection){
      let con = new ConnectionRecord({model:connection});
      this.$tableBody.append(con.render().el);
    },

    onRemoveConnection: function(con){
    },

    getPaginationData: function(){
      
      let s = ConnectionStore,
          pageStart = (s.state.currentPage-1)*s.state.pageSize + 1, 
          pageEnd;
      
      if( (s.state.currentPage+1)*s.state.pageSize > s.state.totalRecords){
        pageEnd = s.state.totalRecords;
      }else{
        pageEnd = (s.state.currentPage+1)*s.state.pageSize;
      }
      
      return {
        pageStart: pageStart,
        pageEnd  : pageEnd,
        totalRecords: s.state.totalRecords
      };
    },

		render: function () {
      const me = this;
      let data = this.getPaginationData();
      this.$el.html(this.template(data));
      me.initPagination();
      return this;  
    },

    initPagination: function(){
      const me = this;
      this.$el.find('.pagination').twbsPagination({
        totalPages  : me.config.collection.state.totalPages,
        visiblePages: 10,
        disableLoad : true,
        onPageClick: function (event, page) {
          if(!this.disableLoad){
            me.config.collection.getPage(page);
          }
          this.disableLoad = false;
        }
      });
    },

    initAuth: function(){
      if(User.hasAccess(Constants.Role.OPERATOR)){
        this.$el.find('.checkbox, .js-item').removeClass('hidden');
      }else{
        this.$el.find('.checkbox, .js-item').addClass('hidden');
      }
    }

	});

	return ConnectionTable;
});