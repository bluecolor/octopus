define([
	'underscore',
	'backbone',
  'text!templates/footer/html/footer.html',
  'ajax/Version'
], function (_, Backbone, template, Version) {
	'use strict';

	let Footer = Backbone.View.extend({

		el: '',
    tagName  : 'footer',
    className: 'main-footer',
	  template : _.template(template),
		events   : {
		},

		initialize: function () {
      return this;
    },

    version: function(){
      const me = this;
      Version.version().done(function(d){
        const major = d.major.split("=")[1],
          minor = d.minor.split("=")[1],
          versionCode = d.versionCode.split("=")[1],
          date = d.date.substring(1);
        me.$el.find('.js-version').text(`${major}.${minor}.${versionCode}`);
        me.$el.find('.js-build-date').text(`${date}`);
      });
    },

		render: function () { 	
      this.$el.html(this.template());
      this.version();
      return this;
    }
	});

	return Footer;
});