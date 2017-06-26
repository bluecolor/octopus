define([
	'underscore',
  'backbone',
  'text!templates/widget/editor/html/editor.html',
  'ace/ace'
], function (_, Backbone, template, ace) {
	'use strict';

	let Editor = Backbone.View.extend({

		el: '',

    tagName   : 'div',
    className : 'script-editor',
		template  : _.template(template),

    events: {
		},

		initialize: function () {
		},

		render: function () { 	  
      const me = this;    
      
      this.$el.html(this.template());
      this.$el.attr('id',$.guid++);
      
      //todo
      setTimeout(function(){
        me.editor = ace.edit(me.$el.attr('id') );
        me.editor.$blockScrolling = Infinity;
        me.editor.setFontSize(16);
        // me.editor.on('input', function(){
        //   console.log(me.$el.attr('id') );
        //   // me.$el.trigger('input', me.editor.getSession().getValue());
        // });
      },0);
      
      return me;
    },

    setMode: function(m){
      switch(m){
        case 'javascript': 
          this.editor.getSession().setMode("ace/mode/javascript"); 
          break;
        case 'sql':
          this.editor.getSession().setMode("ace/mode/sql"); 
          break;
        case 'scala':
          this.editor.getSession().setMode("ace/mode/scala"); 
          break;
        case 'ruby':
          this.editor.getSession().setMode("ace/mode/ruby"); 
          break;
        case 'python':
          this.editor.getSession().setMode("ace/mode/python"); 
          break;
        case 'batchfile':
          this.editor.getSession().setMode("ace/mode/python"); 
          break;
        default:
          this.editor.getSession().setMode("ace/mode/batchfile"); 
          break;
      }
    },

    getValue: function(){
      return this.editor.getSession().getValue();
    },

    setValue: function(v){
      if(v){
        this.editor.getSession().setValue(v);
      }
      return this;
    },

    show: function(){
      this.$el.hide();
    },

    hide: function(){
      this.$el.show();
    }

	});

	return Editor;
});