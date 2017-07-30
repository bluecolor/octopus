define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  const protect = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to protect plan');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/plans/protect/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const unProtect = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to remove plan protection');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/plans/un-protect/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const deleteAllSessions = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to remove plan sessions!');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/plans/${id}/sessions`,
      dataType: 'json',
      type    : 'delete',
      contentType: 'application/json',
      error   : error
    });
  };



  return {
    protect,
    unProtect,
    deleteAllSessions
  }


});