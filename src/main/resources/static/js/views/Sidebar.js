define([
	'underscore',
  'backbone',
  'text!templates/sidebar/html/sidebar.html'
], function (_, Backbone, template) {
	'use strict';

	// Our overall **AppView** is the top-level piece of UI.
	let Sidebar = Backbone.View.extend({

		el: '',
    tagName  : 'aside',
    className: 'main-sidebar',
    template : _.template(template),

		events: {
      // "click .js-nav-connections": "onNavConnections",
      // "click .js-nav-scheduler"  : "onNavScheduler"
		},

		initialize: function () {
		},

		render: function () { 	
      this.$el.html(this.template());
      this.tree();
      return this;
    },

    // onNavScheduler: function(){
    //   Backbone.trigger("route:scheduler");
    // },

    // onNavConnections: function(){
    // },

    tree : function(){
      var _this = this;
      
      $(document).off('click', '.sidebar li a')
      .on('click', '.sidebar li a', function (e) {
        var $this = $(this);
        var checkElement = $this.next();
        var animationSpeed = 500;

        if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible')) && (!$('body').hasClass('sidebar-collapse'))) {
          checkElement.slideUp(animationSpeed, function () {
            checkElement.removeClass('menu-open');
          });
          checkElement.parent("li").removeClass("active");
        }
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
          //Get the parent menu
          var parent = $this.parents('ul').first();
          //Close all open menus within the parent
          var ul = parent.find('ul:visible').slideUp(animationSpeed);
          //Remove the menu-open class from the parent
          ul.removeClass('menu-open');
          //Get the parent li
          var parent_li = $this.parent("li");

          //Open the target menu and add the menu-open class
          checkElement.slideDown(animationSpeed, function () {
            //Add the class active to the parent li
            checkElement.addClass('menu-open');
            parent.find('li.active').removeClass('active');
            parent_li.addClass('active');
            //Fix the layout in case the sidebar stretches over the height of the window
            _this.trigger('fixlayout');
          });
        }
        //if this isn't a link, prevent the page from being redirected
        if (checkElement.is('.treeview-menu')) {
          e.preventDefault();
        }
      });
    }

	});

	return Sidebar;
});