define([
	'underscore',
  'backbone',
  'text!templates/shared/html/import.html'
], function (_, Backbone, template) {
  'use strict';

	var Import = Backbone.View.extend({

    tagName   : 'section',
    template  : _.template(template),
    events    : {
      'click .js-cancel-btn': 'onCancel'
    },

		initialize: function (o) {
      this.config = {
        title: false,
        import: o
      };
      return this;
    },

		render: function () { 	
      let me = this;
      this.$el.html(this.template(this.config));
      this.$el.find('.js-import').fileinput({
        uploadUrl: '/api/v1/scheduler/import',
        previewFileType: "text",
        maxFilePreviewSize: 10240,
        allowedFileExtensions: ["json"],
        maxFileCount: 5,
        uploadAsync: false,
      });

      this.$el.find('.js-import').on('filebatchpreupload',function(){
        me.config.import.cb();
      });

      
      return this;
    },

    onCancel: function(){
      window.history.back();
    },

    show: function(){
    },

    hide: function(){
      this.$el.remove();
    }

	});

	return Import;
});