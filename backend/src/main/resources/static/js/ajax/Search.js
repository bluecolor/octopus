define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  const search = (q) => {
    if(_.isEmpty(q)){
      return;
    }

    return $.ajax({
      url     : `api/v1/search?q=${q}`,
      type    : 'get',
      dataType: 'json',      
      contentType: 'application/json',
      error   : () => {
        console.log('unable to search task');
      }
    });

  };




  return {
    search,
  }


});