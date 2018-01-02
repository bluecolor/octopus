define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  const version = () => {
    
    return $.ajax({
      url     : `api/v1/scheduler/version`,
      type    : 'get',
      dataType: 'json',      
      contentType: 'application/json',
      error   : () => {
        console.log('unable to get version');
      }
    });
  };




  return {
    version,
  }


});