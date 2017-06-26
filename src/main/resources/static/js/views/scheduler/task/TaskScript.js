define([
	'underscore',
  'backbone',
  'text!templates/scheduler/task/html/script.html',
  'constants/index',
  'views/widget/editor/Editor',
  'views/shared/TechnologyList',
  'collections/TechnologyStore'
], function (_, Backbone, template, Constants, Editor, TechnologyList, TechnologyStore) {
	'use strict';

	let TaskScript = Backbone.View.extend({

		el: '',
    tagName   : 'div',
    className : '',
		template  : _.template(template),
    events    : {
		},

    getValue: function(){
      return this.editor.getValue();
    },

    setValue: function(s, t){
      this.editor.setValue(s);
      this.technology.setValue(t);
      const lang = Constants.Technology.getLang(parseInt(t));
      this.setMode(lang);
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
    },

    setMode: function(mode){
      this.editor.setMode(mode)
    }

	});

	return TaskScript;
});