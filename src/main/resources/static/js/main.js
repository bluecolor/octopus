/*global require*/
'use strict';

define('jquery', [], function() {
    return jQuery;
});


// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
    
		backbone: {
			deps: [
				'underscore'
			],
			exports: 'Backbone'
		},
		backboneLocalstorage: {
			deps: ['backbone'],
			exports: 'Store'
		},
    paginator: {
      deps: ['backbone'],
      exports: 'Backbone.Paginator'
    }
	},
	paths: {
		ace: '../bower_components/ace/lib/ace',
    underscore: '../bower_components/underscore/underscore',
		backbone: '../bower_components/backbone/backbone',
		backboneLocalstorage: '../bower_components/backbone.localStorage/backbone.localStorage',
		text: '../bower_components/text/text',
    paginator: '../bower_components/backbone.paginator/lib/backbone.paginator.min'
	}
});

require([
  'underscore',
	'backbone',
	'views/App',
	'routers/AppRouter'
], function (_, Backbone, App, AppRouter) {
	/*jshint nonew:false*/
	// Initialize routing and start Backbone.history()
	new AppRouter();
	Backbone.history.start();
  Backbone.pubSub = _.extend({}, Backbone.Events);


	// Initialize the application view
	new App();
});
