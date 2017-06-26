/**
 * @deprecated since version 0.4.5
 */

define([
	'underscore',
  'backbone',
  'text!templates/widget/select_list/html/select-list.html',
  'text!templates/widget/select_list/html/button.html'
], function (_, Backbone, template, buttonTemplate) {
	'use strict';

	let SelectList = Backbone.View.extend({

    tagName   : 'div',
    className : 'form-group input-group',
		template  : _.template(template),
    buttonTemplate: _.template(buttonTemplate),

    events: {
      'change .js-select-list': 'onChange'
		},


    onChange: function(){
      let $s = this.$el.find('select')
      this.trigger('change',$s);
    },
    

		initialize: function(o) {
      
      this.config = {
        name       : 'select',
        collection : null,
        label      : 'Options',
        textProp   : 'name',
        valueProp  : 'id',
        button     : false, 
        typeAhead  : false,
      };
      
      this.setOptions(o);  
    },

    setOptions: function(o){
      if(!_.isEmpty(o)){
        this.config.collection = o.collection ||this.config.collection;
        this.config.label = o.label || this.config.label;
        this.config.textProp = o.textProp || this.config.textProp;
        this.config.valueProp= o.valueProp|| this.config.valueProp;
        this.config.button = o.button || this.config.button;
        this.config.name = o.name || this.config.name;
        this.config.typeAhead = o.typeAhead || this.config.typeAhead;  
      }
    },

    typeAhead: function(){
      let me = this;

      this.$el.find('select').selectize({
        valueField : 'id',
        labelField : 'name',
        searchField: 'name',
        create: false,
        score: function(search) {
          var score = this.getScoreFunction(search);
          return function(item) {
            return score(item) * (1 + Math.min(item.priority / 100, 1));
          };
        },
        load: function(query, callback) {
          if (!query.length ||  _.isNaN(query) ) return callback();

          $.ajax({
            url: `${me.config.typeAhead.url}/${encodeURIComponent(query)}`,
            type: 'GET',
            error: function() {
              callback();
            },
            success: function(res) {
              callback(res.slice(0, 10));
            }
          });
        }
      });
      
    },
		
    render: function () { 	
      let label = this.config.label,
          typeAhead = this.config.typeAhead;

      this.$el.html(this.template({label, typeAhead}));
      
      if(!typeAhead){
        this.addOptions();
      }else{
        this.typeAhead();
      }
      
      this.$el.css({
        'width': '100%'
      });
      this.$el.find('select').attr('name', this.config.name);

      if(this.config.button){
        let buttonLink = '#';
        if(_.isString(this.config.button)){
          buttonLink = this.config.button;
        }else if(_.isObject(this.config.button)){
          buttonLink = this.config.button.link;
        }else{
          console.warn('missing button link in select-list'); 
        }
        this.$el.find('select.form-control').css('border-radius','3px 0px 0px 3px');
        this.$el.append($(this.buttonTemplate({buttonLink})));
      }else{
        this.$el.find('select.form-control').css('border-radius','3px');
      }

      this.$el.find('select').prop("selectedIndex", -1);

      return this;
    },

    addOptions: function(){
      if(_.isEmpty(this.config.collection)|| _.isEmpty(this.config.collection.models)) return;

      let me = this,
          options = this.config.collection.models,
          select  = this.$el.find('select');
      
      _.each(options, function(option){
        select.append($("<option />").val(option.get(me.config.valueProp)).text(option.get(me.config.textProp)));
      });      
    },

    getValue: function(){
      return this.$el.find('select').val();
    },

    setValue: function(v){
      this.$el.find('select').val(v);
    },

    show: function(){
      this.$el.hide();
    },

    hide: function(){
      this.$el.show();
    }

	});

	return SelectList;
});