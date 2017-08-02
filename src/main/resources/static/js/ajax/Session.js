define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  const stop = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to stop session');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/sessions/${id}/stop`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const start = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to start session');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/sessions/${id}/start`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };



  return {
    stop,
    start
  }


});