define([
	'underscore',
  'backbone',
  'text!templates/scheduler/session/html/session-view.html',
  'constants/Route',
  'collections/SessionStore',
  'views/scheduler/session/ZeroSession',
  'views/scheduler/session/SessionTable',
  'views/scheduler/session/Session'
  ], function (_, Backbone, template, Route, SessionStore, ZeroSession, SessionTable, Session) {
	'use strict';

	let SessionView = Backbone.View.extend({

		
    tagName   : 'section',
    className : 'content js-sch-plan-view',
    template  : _.template(template),
		events    : {
		},

		initialize: function(){
      this.config = {
        activeView: null
      };
      return this;
    },

    hideActiveView: function(){
      if(this.config.activeView){
        this.config.activeView.$el.remove();
        this.config.activeView = null;
      }
    },

    showZeroSession: function(){
      console.log('show zero session')
      this.hideActiveView();
      if(!this.zeroSession){
        this.zeroSession = new ZeroSession();
        this.$el.append(this.zeroSession.render().el);
      }else {
        this.zeroSession.$el.show();
      }
      this.config.activeView = this.zeroSession; 
    },

    showSession: function(o){
      this.hideActiveView(); 
      this.session = new Session(o.id);   
      this.$el.append(this.session.render().el); 
      this.activeView = this.session;
    },

    showSessionTable: function(o){      
      this.hideActiveView();
      if(_.isEmpty(SessionStore.models)){
        this.showZeroSession();
      }else{
        this.sessionTable = new SessionTable();
        this.$el.append(this.sessionTable.render().el); 
        this.activeView = this.sessionTable;
      }
    },

    show: function(o){
      switch(o.route){
        case Route.SCHEDULER_SESSIONS: 
          this.showSessionTable(o);
          break;
        case Route.SCHEDULER_SESSIONS_EDIT:
          this.showSession(o);
          break;
      }
      this.$el.show();
    },

    hide: function(){
      this.$el.hide();
    },

		render: function () { 	
      const me = this;
      this.$el.html(this.template());
      
      setTimeout(function(){
        me.$el.find("input.slider").slider({
          ticks: [1,2,3,4],
          ticks_labels: ["Low", "Medium", "High","Top"],
        });
      },10);
      
      return this;
    }

	});

	return SessionView;
});