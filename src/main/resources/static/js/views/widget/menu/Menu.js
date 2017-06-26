define([
	'underscore',
  'backbone',
  'constants/Color'
], function (_, Backbone, Color) {
	'use strict';

  let MenuItem = Backbone.View.extend({

    tagName  : 'li',
    className: '',
    initialize: function(item){
      this.item = item;
      return this;
    },

    render: function(){
      
      let status = '';

      if(this.item === '-'){
        this.$el.addClass('divider');
        return this;
      }

      if(this.item.status){
        status = `
          <span class="label ${Color.getLabelByStatus(this.item.status)}" style="margin-right:10px;">
            ${this.item.status}
          </span>
        `;
      }

      let $a = $(
        `
        <a tabindex="-1" href="${this.item.url}" item-data="${this.item.data}" href='javascript:void(0);'>
          ${status}
          ${this.item.name}
        </a>
        `
      );
      this.$el.append($a);
      return this;
    }

  });


	let Menu = Backbone.View.extend({

    tagName   : 'div',
    className : 'dropdown clearfix',
		
    events: {
		},

		initialize: function(o) {
      this.items = o.items;
      this.render();
      return this;  
    },

		render: function () { 	
      const me = this;

      let $ul = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;"></ul>')
      me.$el.append($ul);

      _.each(me.items, function(item){
        let mi = new MenuItem(item);
        $ul.append(mi.render().el);
      });

      setTimeout(()=>{
        $(document).bind("click", ()=> {
          me.$el.remove();
        });
      },20);
      
      this.$el.bind("click", ()=> {
        me.$el.remove();
      });

      return me;
    },

    hide: function(){
      this.$el.remove();
    }

  });

  return Menu;

	});

