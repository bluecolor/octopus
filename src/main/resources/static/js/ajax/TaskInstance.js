define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';


  const findOne = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to get session task');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/task-instances/${id}`,
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json',
      error   : error
    });
  };

  const done = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to make task done!');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/task-instances/done/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const block = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to block task');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/task-instances/block/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const stop = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to stop task');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/task-instances/stop/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const start = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to start task');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/task-instances/start/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };


  return {
    findOne,
    block,
    stop,
    done,
    start
  }


});