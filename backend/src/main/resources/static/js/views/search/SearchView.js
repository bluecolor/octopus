define([
	'underscore',
  'backbone',
  'text!templates/search/html/search.html',
  'text!templates/search/html/search-record.html',
  'collections/SearchStore'
], function (_, Backbone, template, searchRecordTemplate,SearchStore) {
	'use strict';


  let SearchRecord = Backbone.View.extend({
    tagName   : 'tr',
    className : '',
    template  : _.template(searchRecordTemplate),
    initialize: function(){
    },
    render: function () {
      switch(this.model.resultType){
        case 'Task' : this.model.resultTypeIconCls = 'fa-cog text-red-plum'; break;
        case 'Group': this.model.resultTypeIconCls = 'fa-cubes text-green';  break;
        case 'User' : this.model.resultTypeIconCls = 'fa-user text-info'; break;
        case 'Connection' : this.model.resultTypeIconCls = 'fa-plug text-info'; break;
        default : this.model.resultTypeIconCls = 'fa-circle text-info'; break;
      }
      this.$el.html(this.template(this.model));
      return this;
    }

  });

	let SearchView = Backbone.View.extend({

    tagName   : 'section',
    className : 'search-view js-search-view',
    template  : _.template(template),
		events: {
		},

		initialize: function () {
      const me = this;
      Backbone.history.navigate("/search");
		},

		render: function (text) { 	
      this.$el.html(this.template());
      this.initSearch(text);
      return this;
    },

    initSearch: function(text){
      const me=this,$s = this.$el.find('input[name="search"]');

      $s.val(text).focus();

      setTimeout(function(){
        $s.focus();
      },500)

      $s.typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
        autoselect: true
      },{
        limit  : 10,
        name   : 'name',
        display: 'name',
        source : function(query, syncResults, asyncResults) {
          SearchStore.setQuery(query).fetch({
            reset: true,
            fetch: true,
            success: function(collection, data){
              asyncResults(data);
              me.setPagination();
              me.renderSearchResult();
            }  
          });
        },
        templates: {
          suggestion: (data) => {
            let icon = 'fa-circle-o';
            switch(data.resultType){
              case 'Task' : icon = 'fa-cog text-red-plum'; break;
              case 'Group': icon = 'fa-cubes text-green';  break;
              case 'User' : icon = 'fa-user text-info'; break;
              case 'Connection': icon = 'fa-plug text-info'; break;
            }
            return `<i style="opacity:0.5;" class="fa ${icon}"><span style="margin-left:10px">${data.name}</span><span style="color:#c6bcbc" class="pull-right">${data.resultType}</span></i>`;
          }
        }
      });

      $s.on('typeahead:open', (event, datum) =>{
        $('.tt-menu').width($s.outerWidth());
      });

      $s.bind('typeahead:selected', function(obj, datum, name) {      
        SearchStore.setQuery(datum.name).fetch({
          reset: true,
          fetch: true,
          success: function(collection, data){
            me.setPagination();
            me.renderSearchResult();
          }  
        });
      });

    },

    setPagination: function(){
      
      if(SearchStore.state.totalPages == 0 || SearchStore.state.totalPages == undefined){
        return;
      }
      
      const me = this;
      this.$el.find('.pagination').twbsPagination({
        totalPages  : SearchStore.state.totalPages,
        visiblePages: 10,
        disableLoad : true,
        onPageClick: function (event, page) {
          SearchStore.getPage(page-1);
          me.renderSearchResult();
        }
      });
    },

    renderSearchResult: function() {
      const data = SearchStore.models.map(m=>m.attributes);
      const body = this.$el.find('.js-search-table-body');
      body.empty();
      if(_.isEmpty(data)){
        this.$el.find('.js-search-result').addClass('hidden');
        return;
      }
      this.$el.find('.js-search-result').removeClass('hidden');
      
      _.each(data,(d)=>{
        let r = new SearchRecord({model:d});
        body.append(r.render().el);
      });
    }

	});

	return SearchView;
});