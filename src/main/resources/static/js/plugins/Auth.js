define([
	'underscore',
  'ajax/User'
], function (_, User) {
	'use strict';

  const auth = function(o){
    _.each(o.items, function(item){
      if(User.hasAccess(item.role)){
        item.el.removeClass('hidden');
      }else{
        item.el.addClass('hidden');
      }
    });
  } 

	return {
    auth
  };
});