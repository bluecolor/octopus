define([
	'underscore',
  'backbone',
  'views/Header',
  'views/Sidebar',
  'views/Footer',
  'views/Center',
  'collections/index',
  'ajax/Socket',
  'ajax/User',
], function (_, Backbone, Header, Sidebar, Footer, Center, Store,Socket,User) {
	'use strict';

	let App = Backbone.View.extend({

    el: '',

    events: {
    },

    initialize: function () {
      let me = this; 
      const header  = new Header(),
            sidebar = new Sidebar(),
            footer  = new Footer(),
            center  = new Center();
      

      this.$header  = $('header');            
      this.$body    = $('body');
      this.$wrapper = $('.wrapper');
      
      this.$header.append(header.render().el);
      this.$wrapper.append(sidebar.render().el); 
      this.$wrapper.append(footer.render().el);
      $('.content-wrapper').append(center.render().el);

      this.layout.activate();
      this.pushMenu.activate("[data-toggle='offcanvas']");
      sidebar.on('fixlayout',function(){
        me.layout.fix();
      });
      
      this.listen();
      

      const loadAlerts = function(){
        const a = Store.AlertStore.models.length;
        if(a>0){
          $(".js-alert-btn").removeClass('hidden');
          $(".js-alert-btn span").text(a);
        }else{
          $(".js-alert-btn").addClass('hidden')
        }
      };

      Store.ConnectionStore.fetch({data:{fetch:true, type:"get"}});
      Store.TechnologyStore.fetch({data:{fetch:true, type:"get"}});
      Store.PlanStore.fetch({data:{fetch:true, type:"get"}});
      Store.GroupStore.fetch({data:{fetch:true, type:"get"}});
      Store.SessionStore.getFirstPage();
      Store.TaskStore.fetch({data:{fetch:true, type:"get"}});
      Store.UserStore.fetch({data:{fetch:true, type:"get"}});
      Store.ParameterStore.fetch({data:{fetch:true, type:"get"}});
      Store.SettingStore.fetch({data:{fetch:true, type:"get"}});
      Store.AlertStore.fetch({data:{fetch:true, type:"get"}}).done(function(){
        loadAlerts();
      });
      Socket.connect();
      
      setInterval(function(){
        Store.AlertStore.fetch({data:{fetch:true, type:"get"}}).done(function(){
          loadAlerts();  
        });
      },15000);
      User.init();
  
    },


    listen: function(){
      setTimeout(()=>{
        window.location.href = "/#/scheduler"; 
        Backbone.trigger("route",{route: "SCHEDULER"});
      },500);
    },

    render: function () {	
      return this;
    },
      
    layout: {
      activate: function() {
        let me = this;
        me.fix();
        me.fixSidebar();
        $(window, ".wrapper").resize(() => {
          me.fix();
          me.fixSidebar();
        });
      },
      fix: function() {
        //Get window height and the wrapper height
        const neg = $('.main-header').outerHeight() + $('.main-footer').outerHeight();
        const window_height = $(window).height();
        const sidebar_height = $(".sidebar").height();
        
        //Set the min-height of the content and sidebar based on the
        //the height of the document.
        if ($("body").hasClass("fixed")) {
          $(".content-wrapper, .right-side").css('min-height', window_height - $('.main-footer').outerHeight());
        } else {
          let postSetWidth;
          if (window_height >= sidebar_height) {
            // $(".content-wrapper, .right-side").css('min-height', window_height - neg);
            postSetWidth = window_height - neg;
          } else {
            $(".content-wrapper, .right-side").css('min-height', sidebar_height);
            postSetWidth = sidebar_height;
          }

          //Fix for the control sidebar height
          const controlSidebar = $(".control-sidebar");
          if (typeof controlSidebar !== "undefined") {
            if (controlSidebar.height() > postSetWidth)
              $(".content-wrapper, .right-side").css('min-height', controlSidebar.height());
          }
        }
      },
      fixSidebar: function () {
        //Make sure the body tag has the .fixed class
        if (!$("body").hasClass("fixed")) {
          if (typeof $.fn.slimScroll != 'undefined') {
            $(".sidebar").slimScroll({destroy: true}).height("auto");
          }
          return;
        } else if (typeof $.fn.slimScroll == 'undefined' && window.console) {
          window.console.error("Error: the fixed layout requires the slimscroll plugin!");
        }
        //Enable slimscroll for fixed layout
        if ($.Octopus.options.sidebarSlimScroll) {
          if (typeof $.fn.slimScroll != 'undefined') {
            //Destroy if it exists
            $(".sidebar").slimScroll({destroy: true}).height("auto");
            //Add slimscroll
            $(".sidebar").slimscroll({
              height: ($(window).height() - $(".main-header").height()) + "px",
              color: "rgba(0,0,0,0.2)",
              size: "3px"
            });
          }
        }
      }
    },

    pushMenu : {
      
      screenSizes : {
          xs: 480,
          sm: 768,
          md: 992,
          lg: 1200
      },

      activate: function(toggleBtn) {
        
        var me = this;

        //Enable sidebar toggle
        $(document).on('click', toggleBtn, function (e) {
          
          e.preventDefault();

          //Enable sidebar push menu
          if ($(window).width() > (me.screenSizes.sm - 1)) {
            if ($("body").hasClass('sidebar-collapse')) {
              $("body").removeClass('sidebar-collapse').trigger('expanded.pushMenu');
            } else {
              $("body").addClass('sidebar-collapse').trigger('collapsed.pushMenu');
            }
          }
          //Handle sidebar push menu for small screens
          else {
            if ($("body").hasClass('sidebar-open')) {
              $("body").removeClass('sidebar-open').removeClass('sidebar-collapse').trigger('collapsed.pushMenu');
            } else {
              $("body").addClass('sidebar-open').trigger('expanded.pushMenu');
            }
          }
        });

        $(".content-wrapper").click(function () {
          //Enable hide menu when clicking on the content-wrapper on small screens
          if ($(window).width() <= (me.screenSizes.sm - 1) && $("body").hasClass("sidebar-open")) {
            $("body").removeClass('sidebar-open');
          }
        });

        // //Enable expand on hover for sidebar mini
        // if ( true //$.Octopus.options.sidebarExpandOnHover
        //   || ($('body').hasClass('fixed')
        //   && $('body').hasClass('sidebar-mini'))) {
        //   this.expandOnHover();
        // }
      },
      expandOnHover: function () {
        var _this = this;
        var screenWidth = this.screenSizes.sm - 1;
        //Expand sidebar on hover
        $('.main-sidebar').hover(function () {
          if ($('body').hasClass('sidebar-mini')
            && $("body").hasClass('sidebar-collapse')
            && $(window).width() > screenWidth) {
            _this.expand();
          }
        }, function () {
          if ($('body').hasClass('sidebar-mini')
            && $('body').hasClass('sidebar-expanded-on-hover')
            && $(window).width() > screenWidth) {
            _this.collapse();
          }
        });
      },
      expand: function () {
        $("body").removeClass('sidebar-collapse').addClass('sidebar-expanded-on-hover');
      },
      collapse: function () {
        if ($('body').hasClass('sidebar-expanded-on-hover')) {
          $('body').removeClass('sidebar-expanded-on-hover').addClass('sidebar-collapse');
        }
      }
    }

  });

	return App;
});
