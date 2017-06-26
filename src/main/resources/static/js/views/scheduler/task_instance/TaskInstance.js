define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task_instance/html/task-instance.html',
  'text!templates/scheduler/task_instance/html/task-instance-general.html',
  'text!templates/scheduler/task_instance/html/task-instance-script.html',
  'text!templates/scheduler/task_instance/html/task-instance-dependencies.html',
  'text!templates/scheduler/task_instance/html/task-instance-dependency-record.html',
  'text!templates/scheduler/task_instance/html/task-instance-groups.html',
  'text!templates/scheduler/task_instance/html/task-instance-group-record.html',
  'text!templates/scheduler/task_instance/html/task-instance-owners.html',
  'text!templates/scheduler/task_instance/html/task-instance-owner-record.html',
  'text!templates/scheduler/task_instance/html/task-instance-logs.html',
  'text!templates/scheduler/task_instance/html/task-instance-log-record.html',
  'plugins/Message',
  'models/TaskInstanceModel',
  'collections/TaskInstanceStore',
  'collections/TechnologyStore',
  'views/widget/editor/Editor',
  'views/shared/TechnologyList',
  'constants/index',
], function (
  _, 
  Backbone, 
  template,
  generalTemplate,
  scriptTemplate,
  dependenciesTemplate,
  dependencyRecordTemplate,
  groupsTemplate,
  groupRecordTemplate,
  ownersTemplate,
  ownerRecordTemplate,
  logsTemplate,
  logRecordTemplate,
  Message, 
  TaskInstanceModel, 
  TaskInstanceStore,
  TechnologyStore,
  Editor,
  TechnologyList,
  Constants
) { 'use strict';



  let TaskInstanceGeneral = Backbone.View.extend({

    tagName   : 'div',
    className : 'js-scheduler-task-instance-general-view',
		template  : _.template(generalTemplate),
    events    : {
		},

		initialize: function (model) {
      this.model = model
    },

		render: function () { 	
      this.$el.html(this.template(this.model.attributes));
      var me = this;
 
      setTimeout(function(){
        me.priority = me.$el.find("input.slider").slider({
          ticks: [1, 2,3,4],
          ticks_labels: ["Low", "Medium", "High","Top"],
        });
      },0);

      return this;
    }

	});

  let TaskInstanceScript = Backbone.View.extend({

		el: '',
    tagName   : 'div',
    className : '',
		template  : _.template(scriptTemplate),
    events    : {
		},

    getValue: function(){
      return this.editor.getValue();
    },

    setValue: function(s, t){
      this.editor.setValue(s);
      this.technology.setValue(t);
      return this;
    },

    getTechnology: function(){
      return this.technology.getValue();
    },

		initialize: function () {
      const me = this;
      this.editor = new Editor();
      this.technology = new TechnologyList({
        label: 'Technology',
        collection: TechnologyStore,
        button: false
      });

      this.technology.on('change',function(e){
        const lang = Constants.Technology.getLang(parseInt(e.val()));
        me.editor.setMode(lang);
      });

    },

		render: function () { 	
      this.$el.html(this.template());
      this.$el.append(this.technology.render().el);
      this.$el.append(this.editor.render().el);
      return this;
    }

	});

  let TaskInstanceDependencyRecord = Backbone.View.extend({
    
    tagName   : 'tr',
    className : '',
    template  : _.template(dependencyRecordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.model.label = Constants.Color.getLabelByStatus(this.model.status)
      this.$el.html(this.template(this.model));
      this.$el.css({
        'border' : '1px solid #ddd'
      });
      return this;
    }
  }); 


  let TaskInstanceDependencies = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-task-instance-dependency-table',
    template  : _.template(dependenciesTemplate),
    events    : {
		},  

		initialize: function() {
      return this;
    },

    addToTable: function(){
               
    },

    getValue: function(){
      return this.config.value;
    },

    setValue: function(instances){
      let me = this;
      me.$tableBody.empty();

      _.each(instances,(instance)=>{
        const i = new TaskInstanceDependencyRecord({model:instance});
        me.$tableBody.append(i.render().el);
      });

      return me;
    },

		render: function(){ 	
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('.js-table-body');

      this.$el.css({
        'padding-left' : '0px',
        'padding-right': '0px'
      });


      return this;
    }

	});

  let TaskInstanceLogRecord = Backbone.View.extend({
    
    tagName   : 'tr',
    className : 'js-log-record',
    template  : _.template(logRecordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.model.label = Constants.Color.getLabelByStatus(this.model.status)
      this.$el.html(this.template(this.model));
      this.$el.css({
        'border' : '1px solid #ddd'
      });
      return this;
    }
  });

  let TaskInstanceLogs = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-task-instance-log-table',
    template  : _.template(logsTemplate),
    events    : {
      'click .js-more': 'onShowLogDetail'
		},  
    pageLength: 12,

		initialize: function() {
      return this;
    },

    onShowLogDetail: function(e){
      const id = $(e.target).parent().attr('model-id')
      const log = _.find(this.logs,l => l.id == id).log;
      const $msg = $(`<pre>${log}</pre>`);
      BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DEFAULT,  
        title: 'Log',
        message   : $msg,
        draggable : true,
        autospin  : true
      });
    },

    showHideMore: function(){
      this.$el.find('a.js-more i').addClass('text-green-fade').removeClass('text-green'); 
      this.$el.find('tr.js-log-record').hover(function() {  
        $(this).find('a.js-more i').addClass('text-green').removeClass('text-green-fade');
      }, function() { 
        $(this).find('a.js-more i').addClass('text-green-fade').removeClass('text-green');
      });
    },

    load: function(logs){
      const me = this;
      me.$tableBody.empty();
      _.each(logs,(log)=>{
        const l = new TaskInstanceLogRecord({model:log});
        me.$tableBody.append(l.render().el);
      });
    },

    setValue: function(logs){
      let me = this;
      me.$tableBody.empty();
      logs = _.isEmpty(logs)?[]:logs
      this.logs = _.sortBy(logs,'date').reverse()
      const totalPages = Math.ceil(this.logs.length/me.pageLength);
      if(totalPages>0){
        this.initPagination(totalPages)
        this.load(this.logs.slice(0,me.pageLength))
      }
      this.showHideMore();
      return me;
    },

    initPagination: function(totalPages){
      const me = this;
      this.$el.find('.pagination').removeClass('hidden').twbsPagination({
        totalPages  : totalPages,
        visiblePages: 5,
        onPageClick: function (event, page) {
          const p = page-1, l = me.pageLength;
          me.load(me.logs.slice(p*l,l*(p+1)));
        }
      });
    },


		render: function(){ 	
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('.js-table-body');

      this.$el.css({
        'padding-left' : '0px',
        'padding-right': '0px'
      });

      return this;
    }

	});

  let TaskInstanceGroupRecord = Backbone.View.extend({
    
    tagName   : 'tr',
    className : '',
    template  : _.template(groupRecordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.$el.html(this.template(this.model));
      this.$el.css({
        'border' : '1px solid #ddd'
      });
      return this;
    }
  });

  let TaskInstanceGroups = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-task-instance-group-table',
    template  : _.template(dependenciesTemplate),
    events    : {
		},  

		initialize: function() {
      return this;
    },

    getValue: function(){
      return this.config.value;
    },

    setValue: function(groups, primary){
      let me = this;
      me.$tableBody.empty();

      _.each(groups,(group)=>{
        const g = new TaskInstanceGroupRecord({model:group});
        me.$tableBody.append(g.render().el);
      });

      if(primary){
        this.setPrimaryGroup(primary.id);    
      }

      return me;
    },

    setPrimaryGroup: function(id){
      const el = this.$el.find(`[model-id=${id}]>i`);
      this.onStarItem({target:el.get(0)});
    },

    onStarItem: function(e){
      $(e.target).closest('table')
      .find('a.js-fav>i')
      .removeClass('fa-star fa-star-o text-yellow');
      $(e.target).addClass('fa-star text-yellow').removeClass('text-gray');
    },

		render: function(){ 	
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('.js-table-body');

      this.$el.css({
        'padding-left' : '0px',
        'padding-right': '0px'
      });

      return this;
    }

	});


  let TaskInstanceOwnerRecord = Backbone.View.extend({
    
    tagName   : 'tr',
    className : '',
    template  : _.template(ownerRecordTemplate),
    initialize: function(){
    },
    render: function () { 	
      this.$el.html(this.template(this.model));
      this.$el.css({
        'border' : '1px solid #ddd'
      });
      return this;
    }
  });


  let TaskInstanceOwners = Backbone.View.extend({

		el: '',
    tagName   : 'section',
    className : 'content js-task-instance-group-table',
    template  : _.template(ownersTemplate),
    events    : {
		},  

		initialize: function() {
      return this;
    },

    getValue: function(){
      return this.config.value;
    },

    setValue: function(users, primary){
      let me = this;
      me.$tableBody.empty();

      _.each(users,(user)=>{
        const u = new TaskInstanceOwnerRecord({model:user});
        me.$tableBody.append(u.render().el);
      });

      if(primary) {
        this.setPrimaryOwner(primary.id);
      }

      return me;
    },

    setPrimaryOwner: function(id){
      const el = this.$el.find(`[model-id=${id}]>i`);
      this.onStarItem({target:el.get(0)});
    },

    onStarItem: function(e){
      $(e.target).closest('table')
      .find('a.js-fav>i')
      .removeClass('fa-star fa-star-o text-yellow');
      $(e.target).addClass('fa-star text-yellow').removeClass('text-gray');
    },

		render: function(){ 	
      this.$el.empty();
      this.$el.html(this.template());
      this.$tableBody = this.$el.find('.js-table-body');

      this.$el.css({
        'padding-left' : '0px',
        'padding-right': '0px'
      });

      return this;
    }

	});



	let TaskInstance = Backbone.View.extend({

    tagName   : 'section',
    className : 'js-scheduler-task-instance-view',
		template  : _.template(template),
    events    : {
      'click .js-cancel-btn': 'onCancel',
      'click .js-save-btn': 'onSave'
    },  


		initialize: function (id) {
      this.model = TaskInstanceStore.get(id);
      this.modelId = id;
      return this;
    },


    renderComponents: function(){
      this.general = new TaskInstanceGeneral(this.model);
      this.script  = new TaskInstanceScript();
      this.dependencies = new TaskInstanceDependencies(); 
      this.groups = new TaskInstanceGroups();
      this.owners = new TaskInstanceOwners();
      this.logs = new TaskInstanceLogs();
      this.$el.find('#task-instance-general').append(this.general.render().el);
      this.$el.find('#task-instance-script').append(this.script.render().el);
      this.$el.find('#task-instance-dependencies').append(this.dependencies.render().el);
      this.$el.find('#task-instance-groups').append(this.groups.render().el);
      this.$el.find('#task-instance-owners').append(this.owners.render().el);
      this.$el.find('#task-instance-logs').append(this.logs.render().el);
    },

		render: function () { 	
      this.$el.html(this.template());
      this.renderComponents();
      this.setValues();
      return this;
    },

    onCancel: function(){
      window.history.back();
    },

    onSave: function(){
      const me = this,
            task  = this.getProps();

      const loading = Ladda.create( document.querySelector('.js-scheduler-task-instance-view .js-save-btn') );
      loading.start();

      const onSuccess = function(){
        Message.notifySuccess('Task saved!');
        window.history.back();
      },
      onError = function(err, response){
        Message.notifyDanger(response.responseJSON.message);
      },
      onComplete = function(){
        loading.stop();
        loading.remove();
      };

      this.model.save(task,{
        success : onSuccess,
        error   : onError,
        complete: onComplete
      });
    },


    enableActionButtons: function(enable){
      if(enable){
        this.$el.find('.js-save-btn').removeClass('disabled');
      }else{
        this.$el.find('.js-save-btn').addClass('disabled');
      }
    },

    setValues: function(){
      const me=this,t = this.model.attributes;
      
      this.general.$el.find('input[name="name"]').val(t.task.name);
      this.general.$el.find('textarea[name="description"]').val(t.task.description);
      setTimeout(()=>{
        me.general.priority.slider('setValue', t.priority);
      },1);
      setTimeout(()=>{
        me.script.setValue(t.script, t.technology?t.technology.id:null);
      },10);
      this.dependencies.setValue(t.dependencies);
      this.groups.setValue(t.task.groups, t.task.primaryGroup);
      this.owners.setValue(t.task.owners, t.task.primaryOwner);
      this.logs.setValue(t.logs);
    },

    getProps: function(){
      let props = {};

      props.id = this.modelId   
      props.priority = this.$el.find('input[name="priority"]').val();
      props.script = this.script.getValue();
      props.technology = parseInt(this.script.getTechnology());
      
      return props;
    }

	});

	return TaskInstance;
});