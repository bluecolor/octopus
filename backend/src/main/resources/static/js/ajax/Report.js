define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  const ownerTaskStats = () => {
    
    return $.ajax({
      url     : `api/v1/reports/owner-task-stats`,
      type    : 'get',
      dataType: 'json',      
      contentType: 'application/json',
      error   : () => {
        console.log('unable to get owner task stats');
      }
    });
  };




  return {
    ownerTaskStats,
  }


});