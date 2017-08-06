define([
	'underscore',
  'plugins/Message',
], function (_, Message) {
	'use strict';

  const run = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to run!');
    };
    
    return $.ajax({
      url     : `api/v1/scheduler/tasks/run/${id}`,
      type    : 'get',
      dataType: 'json',      
      contentType: 'application/json',
      error   : error
    });
  };


  const bookmark = (id) => {
    
    let error = function(){
      Message.notifyDanger('Unable to bookmark task');
    };

    return $.ajax({
      url     : `/api/v1/scheduler/tasks/bookmark/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });

  };

  const unBookmark= (id) => {
    let error = function(){
      Message.notifyDanger('Unable to un-bookmark task');
    };

    return $.ajax({
      url     : `/api/v1/scheduler/tasks/un-bookmark/${id}`,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const findBookmarked = () => {
    let error = function(){
      Message.notifyDanger('Unable to find bookmarked tasks!');
    };

    return $.ajax({
      url     : `/api/v1/scheduler/tasks/bookmarked`,
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json',
      error   : error
    });
  };

  const findByPlan = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to find tasks!');
    };

    return $.ajax({
      url     : `/api/v1/scheduler/tasks/plan/${id}`,
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json',
      error   : error
    });
  };


  const findMyTasks = () => {
    
    let error = function(){
      Message.notifyDanger('Unable to find your tasks!');
    };

    return $.ajax({
      url     : `/api/v1/scheduler/tasks/my-tasks`,
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json',
      error   : error
    });
  };

  const findOne = (id) => {
    let error = function(){
      Message.notifyDanger('Unable to find task!');
    };
    return $.ajax({
      url     : `/api/v1/scheduler/tasks/${id}`,
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json',
      error   : error
    });
  };

  const search = (q) => {
    
    let error = function(){
      Message.notifyDanger('Unable to find tasks!');
    };
    let url = `/api/v1/scheduler/tasks`;

    if(!_.isEmpty(q)){
      url = `/api/v1/scheduler/tasks/search/${q}`;
    }

    return $.ajax({
      url     : url,
      dataType: 'json',
      type    : 'get',
      contentType: 'application/json',
      error   : error
    });
  };

  const disable=(id) => {
    let error = function(){
      Message.notifyDanger('Unable to disable task!');
    };

    let url, data;
    if(_.isArray(id)){
      url  = '/api/v1/scheduler/tasks/disable';
      data = JSON.stringify(id); 
    }else{
      url = `/api/v1/scheduler/tasks/disable/${id}`;
    }

    return $.ajax({
      url     : url,
      data    : data,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };

  const enable= (id) => {
    let error = function(){
      Message.notifyDanger('Unable to enable task!');
    };

    let url, data;
    if(_.isArray(id)){
      url  = '/api/v1/scheduler/tasks/enable';
      data = JSON.stringify(id); 
    }else{
      url = `/api/v1/scheduler/tasks/enable/${id}`;
    }

    return $.ajax({
      url     : url,
      data    : data,
      dataType: 'json',
      type    : 'put',
      contentType: 'application/json',
      error   : error
    });
  };


  return {
    findOne,
    bookmark,
    unBookmark,
    findBookmarked,
    findMyTasks,
    search,
    disable,
    enable,
    run,
    findByPlan
  }


});